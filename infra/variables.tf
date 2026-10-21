variable "aws_profile" {
  type        = string
  description = "AWS CLI profile of the account that owns the deyzito.com zone."
  default     = "pingou"
}

variable "region" {
  type        = string
  description = "Region of the site bucket (São Paulo, close to the visitors)."
  default     = "sa-east-1"
}

variable "domain" {
  type        = string
  description = "Public address of the site."
  default     = "acacia.deyzito.com"
}

variable "zone_name" {
  type        = string
  description = "Existing Route 53 public hosted zone that receives the site record."
  default     = "deyzito.com"
}
