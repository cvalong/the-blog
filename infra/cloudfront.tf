# ---------------------------------------------------------------------------
# CloudFront distribution
# Origin: S3 static website endpoint (HTTP custom origin, public bucket)
# Cache: AWS managed CachingOptimized policy
# Security headers injected via Lambda@Edge (addSecureHeaders)
# ---------------------------------------------------------------------------

locals {
  s3_website_origin_id = "chrisvlong.com.s3-website-us-east-1.amazonaws.com"
  s3_website_endpoint  = "chrisvlong.com.s3-website-us-east-1.amazonaws.com"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = var.domain
  default_root_object = "index.html"
  aliases             = [var.domain, "www.${var.domain}"]
  price_class         = "PriceClass_All"

  origin {
    domain_name = local.s3_website_endpoint
    origin_id   = local.s3_website_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = local.s3_website_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    # AWS managed CachingOptimized policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    # Lambda@Edge: adds secure HTTP response headers (CSP, HSTS, etc.)
    lambda_function_association {
      event_type   = "origin-response"
      include_body = false
      lambda_arn   = "arn:aws:lambda:us-east-1:${var.aws_account_id}:function:addSecureHeaders:6"
    }
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.site.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Project = "the-blog"
    Domain  = var.domain
  }
}
