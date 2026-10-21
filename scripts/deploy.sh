#!/usr/bin/env bash
# Publishes dist/ to acacia.deyzito.com. Always the "pingou" AWS profile, never the default one.
set -euo pipefail

PROFILE=pingou
cd "$(dirname "$0")/.."

BUCKET=$(terraform -chdir=infra output -raw bucket)
DISTRIBUTION=$(terraform -chdir=infra output -raw distribution_id)

aws sts get-caller-identity --profile "$PROFILE" --query Arn --output text

pnpm build

# Hashed assets never change: cache them for a year.
aws s3 sync dist/_astro "s3://$BUCKET/_astro" --profile "$PROFILE" --delete \
  --cache-control "public, max-age=31536000, immutable"

# Pages, sitemap, robots and the rest: always revalidate.
aws s3 sync dist "s3://$BUCKET" --profile "$PROFILE" --delete --exclude "_astro/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --profile "$PROFILE" --distribution-id "$DISTRIBUTION" \
  --paths "/*" --query Invalidation.Id --output text

echo "Published: $(terraform -chdir=infra output -raw url)"
