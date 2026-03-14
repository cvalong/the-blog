# Remote state stored in a dedicated S3 bucket.
#
# Bootstrap this bucket once before running `tofu init`:
#
#   aws s3 mb s3://chrisvlong-terraform-state --region us-east-1
#   aws s3api put-bucket-versioning \
#     --bucket chrisvlong-terraform-state \
#     --versioning-configuration Status=Enabled
#
terraform {
  backend "s3" {
    bucket  = "chrisvlong-terraform-state"
    key     = "the-blog/terraform.tfstate"
    region  = "us-east-1"
    profile = "my-admin-access-profile"
  }
}
