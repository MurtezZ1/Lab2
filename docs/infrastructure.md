# AWS Infrastructure Documentation

## Repository Analysis

The project is a full-stack ML/AI application:

- Frontend: React + Vite in `frontend/`
- Backend/API: Node.js + Express in `backend/`
- Database ORM: Prisma with PostgreSQL
- Realtime/cache integrations: Socket.IO, MongoDB, Redis
- ML code: Python scripts in `ml/`
- Docker: a production backend Dockerfile is provided at `backend/Dockerfile`

Because the repository has a real backend API and ML artifacts/scripts, the infrastructure uses ECS Fargate for the API and S3/SageMaker foundations for ML workloads.

## AWS Services Used

### S3

Four private encrypted buckets are created:

- raw datasets
- processed datasets
- model artifacts
- logs

All buckets block public access, use server-side encryption, and enable versioning.

### ECR

ECR stores the backend API Docker image. Images are scanned on push and old images are removed with a lifecycle policy.

### ECS Fargate

The Node.js/Express backend runs as an ECS Fargate service in private subnets. It is exposed through a public Application Load Balancer.

### VPC

The VPC contains:

- public subnets for the load balancer
- private subnets for ECS tasks
- optional NAT gateway

For `dev`, NAT is disabled by default to reduce cost. For `prod`, NAT is enabled.

### Secrets Manager

Runtime secrets are stored in AWS Secrets Manager:

- `database-url`
- `client-url`
- `jwt-access-secret`
- `jwt-refresh-secret`
- `mongo-url`
- `redis-url`
- `stripe-secret-key`
- `stripe-publishable-key`
- `stripe-webhook-secret`
- `openai-api-key`

Terraform creates the secret containers. Secret values should be inserted manually or through a secure CI/CD process.

### CloudWatch

Backend logs are written to CloudWatch Logs with environment-specific retention.

### SageMaker

Terraform creates a SageMaker execution role with scoped access to the ML S3 buckets. This prepares the project for training jobs, batch transforms, or model hosting.

### GitHub Actions

`.github/workflows/deploy.yml`:

- runs Terraform format check
- runs Terraform init and validate
- runs Terraform plan
- can apply on main branch
- builds the backend Docker image
- pushes it to ECR
- forces a new ECS deployment

## Deployment

Install Terraform locally or run through GitHub Actions.

### Local Dev Plan

```bash
cd infra/terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```

For team or production usage, configure remote Terraform state first:

```bash
cp backend.tf.example backend.tf
```

Then update the S3 state bucket and DynamoDB lock table names in `backend.tf`.

Example `terraform.tfvars`:

```hcl
bucket_name_prefix = "your-unique-electronic-shop"
github_org         = "your-github-username-or-org"
github_repo        = "Lab2"
```

### Apply

```bash
terraform apply
```

After apply, copy these outputs into GitHub repository variables:

- `BACKEND_ECR_REPOSITORY_URL`
- `ECS_CLUSTER_NAME`
- `ECS_SERVICE_NAME`
- `TF_BUCKET_NAME_PREFIX`
- `AWS_REGION`

Add this GitHub secret:

- `AWS_GITHUB_ACTIONS_ROLE_ARN`

## Security

- No AWS credentials are hardcoded.
- GitHub Actions uses OIDC.
- ECS tasks run in private subnets.
- The load balancer is the only public entry point.
- S3 buckets block public access.
- Secrets are injected from AWS Secrets Manager.
- IAM permissions are limited to required ECR, ECS, S3, and Secrets Manager operations.

## Cost Awareness

- Dev uses one ECS task by default.
- Dev disables NAT gateway by default to reduce cost.
- CloudWatch retention is shorter in dev.
- ECR lifecycle policy keeps only the latest 20 images.
- S3 logs expire after 90 days.

## Production Notes

Before production:

- use a real HTTPS listener with ACM certificate
- point `DATABASE_URL` to managed PostgreSQL, preferably RDS
- point `REDIS_URL` to ElastiCache Redis
- point `MONGO_URL` to a managed MongoDB-compatible service
- set strong JWT secrets
- configure autoscaling for ECS
- configure alarms for ECS, ALB, and error rates
