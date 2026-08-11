#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DnsStack } from '../lib/dns-stack';
import { SiteStack } from '../lib/site-stack';

const app = new cdk.App();

const account = (app.node.tryGetContext('account') as string) ?? process.env.CDK_DEFAULT_ACCOUNT;
const region = (app.node.tryGetContext('region') as string) ?? process.env.CDK_DEFAULT_REGION ?? 'us-east-1';
const domainName = app.node.tryGetContext('domainName') as string;
const githubOwner = app.node.tryGetContext('githubOwner') as string;
const githubRepo = app.node.tryGetContext('githubRepo') as string;

// Everything lives in us-east-1 (CloudFront requires its ACM certs there anyway).
const env: cdk.Environment = { account, region };

const dns = new DnsStack(app, 'DnsStack', { env, domainName });

new SiteStack(app, 'SiteStack', {
  env,
  domainName,
  hostedZone: dns.hostedZone,
  githubOwner,
  githubRepo,
});
