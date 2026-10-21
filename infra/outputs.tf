output "bucket" {
  description = "Bucket the deploy script syncs dist/ to."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution the deploy script invalidates."
  value       = aws_cloudfront_distribution.site.id
}

output "url" {
  description = "Public address of the site."
  value       = "https://${var.domain}/"
}
