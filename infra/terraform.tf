terraform {
  required_version = ">= 1.10"

  # State stays local (infra/terraform.tfstate, git-ignored): decision of 2026-10-21.

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
