# AWS Infrastructure

This folder contains Terraform infrastructure for the Electronic Online Shop ML/AI project.

## Structure

```text
infra/
terraform/
environments/
dev/
prod/
modules/
s3/
iam/
vpc/
ecr/
ecs/
sagemaker/
cloudwatch/
secrets/
```

## Main Services

- Amazon S3 for raw datasets, processed datasets, model artifacts, and logs.
- Amazon ECR for backend Docker images.
- Amazon ECS Fargate for the Node.js/Express backend API.
- Application Load Balancer for public API traffic.
- Amazon SageMaker execution role for future model training and hosting jobs.
- AWS Secrets Manager for application secrets.
- Amazon CloudWatch Logs for backend runtime logs.
- Amazon VPC with public and private subnets.
- GitHub Actions with AWS OIDC for CI/CD.

## Notes

Terraform does not store AWS credentials. Use AWS CLI credentials locally or GitHub OIDC in CI/CD.

The app currently depends on PostgreSQL, MongoDB, and Redis connection strings. These are stored as Secrets Manager values and passed into ECS tasks. You can point them to managed AWS services such as RDS PostgreSQL, DocumentDB-compatible MongoDB, and ElastiCache Redis.
