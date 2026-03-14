output "bucket_name" {
  description = "Name of the S3 bucket serving site content"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name (*.cloudfront.net)"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.site.id
}

output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions"
  value       = aws_iam_role.build_process.arn
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate for the domain"
  value       = aws_acm_certificate.site.arn
}
