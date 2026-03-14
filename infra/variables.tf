variable "domain" {
  description = "Primary domain name for the site (e.g. chrisvlong.com)"
  type        = string
  default     = "chrisvlong.com"
}

variable "bucket_name" {
  description = "Name of the S3 bucket that holds the static site files. Set via TF_VAR_bucket_name."
  type        = string
}

variable "distribution_id" {
  description = "ID of the CloudFront distribution. Set via TF_VAR_distribution_id."
  type        = string
}

variable "github_org" {
  description = "GitHub organization or username that owns the repo (used in OIDC trust policy)"
  type        = string
  default     = "cvalong"
}

variable "github_repo" {
  description = "GitHub repository name (used in OIDC trust policy)"
  type        = string
  default     = "the-blog"
}

variable "aws_account_id" {
  description = "AWS account ID — used to construct ARNs"
  type        = string
  default     = "992382687207"
}
