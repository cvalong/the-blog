# Infrastructure as Code — chrisvlong.com

This directory codifies the AWS infrastructure for `chrisvlong.com` using
[OpenTofu](https://opentofu.org/) (an MIT-licensed fork of Terraform with
identical HCL syntax). The resources were originally created manually; this
config imports them so they are versioned, documented, and reproducible.

---

## What is OpenTofu?

OpenTofu is a declarative tool: you describe the desired state of your
infrastructure in `.tf` files, and OpenTofu figures out what API calls to make
to reach that state. The key ideas:

- **Providers** — plugins that talk to cloud APIs (here: AWS)
- **Resources** — the actual AWS objects (S3 bucket, CloudFront distribution, …)
- **State** — a JSON snapshot OpenTofu keeps that maps your config to real
  resource IDs. Stored remotely in S3 so it's never lost and is safe from
  concurrent edits.
- **Plan / Apply** — `tofu plan` shows what *would* change; `tofu apply`
  makes it happen. Always plan before applying.

---

## Prerequisites

1. **Install OpenTofu**
   ```bash
   # macOS (Homebrew)
   brew install opentofu

   # Verify
   tofu version
   ```

2. **AWS credentials** — the usual chain works (env vars, `~/.aws/credentials`,
   SSO). The identity you use needs sufficient IAM permissions to read/write the
   resources defined here plus write access to the state S3 bucket.

   ```bash
   aws sts get-caller-identity   # confirm you're authenticated
   ```

---

## One-time state bucket bootstrap

Before you can run `tofu init`, the remote state bucket must exist. Create it
once — manually, since OpenTofu can't manage its own state backend:

```bash
aws s3 mb s3://chrisvlong-terraform-state --region us-east-1

aws s3api put-bucket-versioning \
  --bucket chrisvlong-terraform-state \
  --versioning-configuration Status=Enabled
```

Versioning is enabled so you can recover from accidental state corruption by
restoring a previous version of `terraform.tfstate`.

---

## Initialise

```bash
cd infra
tofu init
```

This downloads the AWS provider plugin into `.terraform/` (git-ignored) and
configures the S3 backend.

---

## Importing existing resources

The AWS resources were created manually before this config existed. OpenTofu
needs to know about them without re-creating them. `tofu import` reads the real
resource from AWS and writes it into state.

Set the variable values first (values come from GitHub secrets / AWS console):

```bash
export TF_VAR_bucket_name=<your-bucket-name>
export TF_VAR_distribution_id=<your-distribution-id>
```

Then import each resource:

```bash
# S3
tofu import aws_s3_bucket.site              "$TF_VAR_bucket_name"
tofu import aws_s3_bucket_policy.site       "$TF_VAR_bucket_name"
tofu import aws_s3_bucket_public_access_block.site "$TF_VAR_bucket_name"

# CloudFront — look up the OAC ID in the AWS console (CloudFront → Origin access)
tofu import aws_cloudfront_origin_access_control.site <OAC_ID>
tofu import aws_cloudfront_distribution.site           "$TF_VAR_distribution_id"

# IAM — look up ARNs in IAM → Identity providers / Roles
tofu import aws_iam_openid_connect_provider.github <OIDC_PROVIDER_ARN>
tofu import aws_iam_role.build_process              BuildProcess
tofu import aws_iam_role_policy.build_process       BuildProcess:DeployPolicy

# ACM — look up in Certificate Manager (must be us-east-1)
tofu import aws_acm_certificate.site <ACM_CERT_ARN>
```

After all imports:

```bash
tofu plan   # target: zero changes
```

If `tofu plan` shows differences, update the `.tf` files to match the real
resource configuration, then re-run plan until it's clean.

---

## Day-to-day workflow

```
# 1. Make changes to .tf files
# 2. Preview what will change
tofu plan

# 3. Review the plan carefully, then apply
tofu apply

# 4. Commit the updated .terraform.lock.hcl if provider versions changed
git add infra/.terraform.lock.hcl
git commit -m "chore(infra): update provider lock"
```

> **Never run `tofu apply` without reviewing the plan first.** Accidental
> resource deletion is possible and some AWS changes are irreversible.

---

## Adding new resources

1. Create a new `.tf` file (or add to an existing one that fits the domain,
   e.g. `s3.tf`, `iam.tf`).
2. Run `tofu plan` — OpenTofu will show the resource as `+create`.
3. Run `tofu apply` to provision it.
4. If the resource already exists, use `tofu import` first (see above).

---

## What the state file is

`terraform.tfstate` is a JSON file that records the mapping between your
`.tf` resource blocks and the real AWS resource IDs, along with the last-known
attribute values.

- **Do not edit it manually.** If it gets out of sync, use `tofu state` subcommands.
- **Do not commit it to git.** It can contain sensitive values. The S3 backend keeps it safe and versioned.
- If you lose it, you can re-import all resources — but that's tedious. The S3 backend with versioning prevents this.

---

## File reference

| File | Purpose |
|---|---|
| `providers.tf` | AWS provider version constraint |
| `backend.tf` | S3 remote state configuration |
| `variables.tf` | Input variables (bucket name, distribution ID, …) |
| `outputs.tf` | Values printed after apply |
| `s3.tf` | S3 bucket, public-access block, and bucket policy |
| `cloudfront.tf` | CloudFront OAC and distribution |
| `iam.tf` | GitHub Actions OIDC provider and IAM role |
| `acm.tf` | ACM TLS certificate |
| `.gitignore` | Excludes state, provider cache, and tfvars |

---

## What is NOT managed here

- **Route53 / DNS** — managed externally (out of scope)
- **State S3 bucket** — bootstrapped manually (can't manage its own backend)
- **GitHub secrets** — set in the GitHub repo settings UI
