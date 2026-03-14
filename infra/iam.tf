# ---------------------------------------------------------------------------
# GitHub Actions OIDC provider
# Allows GitHub Actions to exchange a JWT for temporary AWS credentials
# without storing any long-lived secrets.
# ---------------------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # Active thumbprint for token.actions.githubusercontent.com
  thumbprint_list = ["1b511abead59c6ce207077c0bf0e0043b1382612"]
}

# ---------------------------------------------------------------------------
# IAM role assumed by GitHub Actions during deployments
# ---------------------------------------------------------------------------

resource "aws_iam_role" "build_process" {
  name        = "BuildProcess"
  description = "aws-v2-GH-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "GitHubOIDC"
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    Project = "the-blog"
  }
}

# ---------------------------------------------------------------------------
# Managed policy granting only the permissions the deploy workflow needs
# ---------------------------------------------------------------------------

resource "aws_iam_policy" "deploy_static_assets" {
  name = "DeployStaticAssets"
  # No description — omitting matches the existing resource and avoids replacement

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "VisualEditor0"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:ListBucket",
          "cloudfront:CreateInvalidation",
        ]
        Resource = [
          "arn:aws:cloudfront::${var.aws_account_id}:distribution/${var.distribution_id}",
          "arn:aws:s3:::${var.bucket_name}/*",
          "arn:aws:s3:::${var.bucket_name}",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "build_process" {
  role       = aws_iam_role.build_process.name
  policy_arn = aws_iam_policy.deploy_static_assets.arn
}
