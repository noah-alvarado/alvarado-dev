import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface DnsStackProps extends cdk.StackProps {
  domainName: string;
}

/**
 * Route 53 public hosted zone for alvarado.dev plus every legacy record that
 * must survive the cutover from Squarespace DNS.
 *
 * NOT copied here (intentionally):
 *  - Apex/`www` A records pointing at Fastly (151.101.x.x) — replaced by the
 *    CloudFront alias records created in SiteStack.
 *  - `_domainconnect` CNAME — Squarespace-registrar-specific, unused once DNS
 *    is authoritative on Route 53.
 *
 * After `cdk deploy DnsStack`, read the zone's nameservers from the stack
 * output and set them at the registrar (Squarespace). ACM validation in
 * SiteStack only succeeds once that cutover has propagated.
 */
export class DnsStack extends cdk.Stack {
  public readonly hostedZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);
    const { domainName } = props;

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });
    this.hostedZone = zone;

    // --- Proton Mail: MX ---
    new route53.MxRecord(this, 'ProtonMx', {
      zone,
      recordName: domainName,
      ttl: cdk.Duration.hours(1),
      values: [
        { priority: 10, hostName: 'mail.protonmail.ch' },
        { priority: 20, hostName: 'mailsec.protonmail.ch' },
      ],
    });

    // --- Apex TXT: SPF + Proton domain verification (one record set, two values) ---
    new route53.TxtRecord(this, 'ApexTxt', {
      zone,
      recordName: domainName,
      ttl: cdk.Duration.hours(1),
      values: [
        'v=spf1 include:_spf.protonmail.ch mx ~all',
        'protonmail-verification=42bca479db1d12d1e64d8d314c0d9ae43abe7d20',
      ],
    });

    // --- DMARC ---
    new route53.TxtRecord(this, 'DmarcTxt', {
      zone,
      recordName: `_dmarc.${domainName}`,
      ttl: cdk.Duration.hours(4),
      values: ['v=DMARC1; p=quarantine; pct=100; adkim=s; aspf=s'],
    });

    // --- Proton Mail DKIM (3 CNAMEs) ---
    const dkimBase =
      'domainkey.dqsmkidvfqpmwbtew4lqpmlhrp6aac7jpag73r3o7csbpbbk5outq.domains.proton.ch';
    const dkimSelectors = ['protonmail', 'protonmail2', 'protonmail3'];
    dkimSelectors.forEach((selector, i) => {
      new route53.CnameRecord(this, `ProtonDkim${i + 1}`, {
        zone,
        recordName: `${selector}._domainkey.${domainName}`,
        ttl: cdk.Duration.hours(4),
        domainName: `${selector}.${dkimBase}`,
      });
    });

    // --- Google site verification ---
    new route53.CnameRecord(this, 'GoogleVerify', {
      zone,
      recordName: `e4hgo7wqddrx.${domainName}`,
      ttl: cdk.Duration.minutes(5),
      domainName: 'gv-hwselwcjellej7.dv.googlehosted.com',
    });

    // --- Local dev helper: localhost.alvarado.dev -> 127.0.0.1 (see vite.config.js) ---
    new route53.ARecord(this, 'LocalhostDev', {
      zone,
      recordName: `localhost.${domainName}`,
      ttl: cdk.Duration.days(7),
      target: route53.RecordTarget.fromIpAddresses('127.0.0.1'),
    });

    new cdk.CfnOutput(this, 'HostedZoneId', { value: zone.hostedZoneId });
    new cdk.CfnOutput(this, 'Nameservers', {
      value: cdk.Fn.join(', ', zone.hostedZoneNameServers ?? []),
      description: 'Set these as the nameservers at the registrar (Squarespace).',
    });
  }
}
