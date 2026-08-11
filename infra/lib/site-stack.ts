import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface SiteStackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: route53.IHostedZone;
  githubOwner: string;
  githubRepo: string;
}

/**
 * Static hosting for alvarado.dev on S3 + CloudFront (us-east-1):
 *  - Prod: apex + www, one distribution, SPA fallback via error responses.
 *  - Preview: *.preview.<domain>, one distribution, host-based prefix rewrite
 *    (CloudFront Function) so each PR (pr-<n>.preview.<domain>) serves from the
 *    S3 key prefix pr-<n>/.
 *  - A GitHub Actions OIDC role scoped to this repo for keyless CI deploys.
 *
 * Everything is in us-east-1 so the DNS-validated ACM certs (which CloudFront
 * requires in us-east-1) live in the same stack. Deploy AFTER the Route 53
 * nameserver cutover has propagated, or cert validation will hang.
 */
export class SiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);
    const { domainName, hostedZone, githubOwner, githubRepo } = props;
    const wwwName = `www.${domainName}`;
    const previewBaseDomain = `preview.${domainName}`;
    const previewWildcard = `*.${previewBaseDomain}`;

    // ---------- Certificates (us-east-1, DNS-validated against the zone) ----------
    const prodCertificate = new acm.Certificate(this, 'ProdCert', {
      domainName,
      subjectAlternativeNames: [wwwName],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const previewCertificate = new acm.Certificate(this, 'PreviewCert', {
      domainName: previewWildcard,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // ---------- Buckets (private; CloudFront OAC only) ----------
    const prodBucket = new s3.Bucket(this, 'ProdBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const previewBucket = new s3.Bucket(this, 'PreviewBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // Previews are ephemeral; allow teardown to fully clean up.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [{ expiration: cdk.Duration.days(30) }],
    });

    // ---------- Origins ----------
    const prodOrigin = origins.S3BucketOrigin.withOriginAccessControl(prodBucket);
    const previewOrigin = origins.S3BucketOrigin.withOriginAccessControl(previewBucket);

    // ---------- Prod distribution ----------
    const prodDist = new cloudfront.Distribution(this, 'ProdDistribution', {
      comment: `${domainName} (prod)`,
      domainNames: [domainName, wwwName],
      certificate: prodCertificate,
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: prodOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      // SPA fallback: OAC on a private bucket returns 403 for missing keys.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
      ],
    });

    // ---------- Preview distribution ----------
    const previewFn = new cloudfront.Function(this, 'PreviewRewriteFn', {
      comment: 'Host-based PR prefix + SPA fallback for previews',
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, 'preview-rewrite.js'),
      }),
    });

    const previewDist = new cloudfront.Distribution(this, 'PreviewDistribution', {
      comment: `${previewBaseDomain} (PR previews)`,
      domainNames: [previewWildcard],
      certificate: previewCertificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: previewOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // No caching so a PR push is visible immediately (no invalidation step).
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        compress: true,
        functionAssociations: [
          { function: previewFn, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
    });

    // ---------- Route 53 alias records ----------
    const prodTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(prodDist));
    new route53.ARecord(this, 'ApexAliasA', { zone: hostedZone, recordName: domainName, target: prodTarget });
    new route53.AaaaRecord(this, 'ApexAliasAAAA', { zone: hostedZone, recordName: domainName, target: prodTarget });
    new route53.ARecord(this, 'WwwAliasA', { zone: hostedZone, recordName: wwwName, target: prodTarget });
    new route53.AaaaRecord(this, 'WwwAliasAAAA', { zone: hostedZone, recordName: wwwName, target: prodTarget });

    const previewTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(previewDist));
    new route53.ARecord(this, 'PreviewAliasA', { zone: hostedZone, recordName: previewWildcard, target: previewTarget });
    new route53.AaaaRecord(this, 'PreviewAliasAAAA', { zone: hostedZone, recordName: previewWildcard, target: previewTarget });

    // ---------- GitHub Actions OIDC deploy role ----------
    // Import an existing account-level provider if one was supplied; otherwise
    // create it (only one provider per URL is allowed per account).
    const existingOidcArn = this.node.tryGetContext('githubOidcProviderArn') as string | undefined;
    const oidcProvider: iam.IOpenIdConnectProvider = existingOidcArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'GitHubOidc', existingOidcArn)
      : new iam.OpenIdConnectProvider(this, 'GitHubOidc', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        });

    const deployRole = new iam.Role(this, 'GitHubDeployRole', {
      roleName: 'alvarado-dev-github-deploy',
      description: 'Assumed by GitHub Actions (OIDC) to deploy the site',
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.OpenIdConnectPrincipal(oidcProvider, {
        StringEquals: { 'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com' },
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${githubOwner}/${githubRepo}:*`,
        },
      }),
    });

    prodBucket.grantReadWrite(deployRole);
    previewBucket.grantReadWrite(deployRole);
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [`arn:aws:cloudfront::${this.account}:distribution/${prodDist.distributionId}`],
      }),
    );
    // CI reads the stack outputs (bucket / distribution ids) at deploy time.
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: [this.stackId],
      }),
    );

    // ---------- Outputs (feed these into GitHub repo variables) ----------
    new cdk.CfnOutput(this, 'ProdBucketName', { value: prodBucket.bucketName });
    new cdk.CfnOutput(this, 'PreviewBucketName', { value: previewBucket.bucketName });
    new cdk.CfnOutput(this, 'ProdDistributionId', { value: prodDist.distributionId });
    new cdk.CfnOutput(this, 'PreviewDistributionId', { value: previewDist.distributionId });
    new cdk.CfnOutput(this, 'PreviewBaseDomain', { value: previewBaseDomain });
    new cdk.CfnOutput(this, 'GitHubDeployRoleArn', { value: deployRole.roleArn });
  }
}
