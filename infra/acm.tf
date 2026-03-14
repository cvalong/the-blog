# ---------------------------------------------------------------------------
# ACM certificate for the domain
#
# CloudFront requires ACM certificates to be in us-east-1 (global edge network).
# This certificate must be validated (via DNS or email) before CloudFront
# can use it. Validation records are managed outside this config
# (DNS is out of scope).
# ---------------------------------------------------------------------------

resource "aws_acm_certificate" "site" {
  domain_name               = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method         = "DNS"

  lifecycle {
    # ACM certificates cannot be destroyed while attached to a CloudFront
    # distribution. Create the replacement before destroying the old one.
    create_before_destroy = true
  }

  tags = {
    Project = "the-blog"
    Domain  = var.domain
  }
}
