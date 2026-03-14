terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Default provider — us-east-1 (where S3, CloudFront, IAM, and ACM all live)
provider "aws" {
  region  = "us-east-1"
  profile = "my-admin-access-profile"
}
