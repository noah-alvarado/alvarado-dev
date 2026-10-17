# infra — AWS CDK app for alvarado.dev

Static hosting on **S3 + CloudFront + Route 53**, defined with AWS CDK (TypeScript).

- **Account:** `034083889387` · **Region:** `us-east-1` (saved in `cdk.json` context).
- Everything lives in `us-east-1` — CloudFront requires its ACM certs there, so
  keeping the whole app in one region avoids cross-region references entirely.

## Stacks

| Stack       | Contents |
| ----------- | -------- |
| `DnsStack`  | Route 53 hosted zone + existing records (Proton MX/SPF/DKIM/DMARC, Google verification, `localhost`). |
| `SiteStack` | ACM certs (prod + preview), prod + preview S3 buckets (private, OAC), CloudFront distributions, Route 53 aliases, GitHub OIDC deploy role. |

## One-time setup

```sh
cd infra
npm install
npx cdk bootstrap aws://034083889387/us-east-1
```

## Deploy — order matters (DNS cutover in the middle)

The ACM certificates are DNS-validated against the Route 53 zone, so the zone must
be authoritative (nameservers cut over) **before** `SiteStack` can finish deploying.

1. **Create the zone**
   ```sh
   npm run deploy:dns
   ```
   Note the `DnsStack.Nameservers` output.

2. **Cut over the registrar** — at Squarespace, set the domain's nameservers to the
   four `ns-*.awsdns-*` values from step 1. Wait for propagation:
   ```sh
   dig +short NS alvarado.dev   # should return the awsdns nameservers
   ```

3. **Deploy the site** (cert validation now resolves; distributions take ~5–15 min):
   ```sh
   npm run deploy:site
   ```

4. **Wire GitHub Actions** — add repo **Variables**
   (Settings → Secrets and variables → Actions → Variables):

   | Repo variable         | Value                 |
   | --------------------- | --------------------- |
   | `AWS_DEPLOY_ROLE_ARN` | `GitHubDeployRoleArn` |
   | `AWS_REGION`          | `us-east-1`           |

   Bucket names, distribution IDs, and the preview base domain are read at
   runtime from `SiteStack` CloudFormation outputs by the
   [`stack-outputs` action](../.github/actions/stack-outputs/action.yml) — no
   need to copy them into repo variables.

## Notes

- Account/region are saved in `cdk.json` context (`account`, `region`). Override per
  command with `-c region=...` if ever needed.
- If the account already has a GitHub OIDC provider, import it instead of recreating:
  `npx cdk deploy SiteStack -c githubOidcProviderArn=arn:aws:iam::034083889387:oidc-provider/token.actions.githubusercontent.com`
- The prod bucket is `RETAIN` on delete (safety); the preview bucket is `DESTROY`
  with `autoDeleteObjects` and a 30-day object expiry.
