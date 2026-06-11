locals {
  backend_repo_name = "backend-api"
}

module "s3" {
  source        = "../../modules/s3"
  project       = var.project
  environment   = var.environment
  name_prefix   = "${var.bucket_name_prefix}-${var.environment}"
  force_destroy = true
}

module "vpc" {
  source             = "../../modules/vpc"
  project            = var.project
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  enable_nat_gateway = var.enable_nat_gateway
}

module "ecr" {
  source           = "../../modules/ecr"
  project          = var.project
  environment      = var.environment
  repository_names = [local.backend_repo_name]
}

module "cloudwatch" {
  source          = "../../modules/cloudwatch"
  project         = var.project
  environment     = var.environment
  log_group_names = ["backend-api"]
  retention_days  = 14
}

module "secrets" {
  source      = "../../modules/secrets"
  project     = var.project
  environment = var.environment
  secret_names = [
    "database-url",
    "client-url",
    "jwt-access-secret",
    "jwt-refresh-secret",
    "mongo-url",
    "redis-url",
    "stripe-secret-key",
    "stripe-publishable-key",
    "stripe-webhook-secret",
    "openai-api-key"
  ]
}

module "ecs" {
  source             = "../../modules/ecs"
  project            = var.project
  environment        = var.environment
  aws_region         = var.aws_region
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  container_image    = "${module.ecr.repository_urls[local.backend_repo_name]}:${var.backend_image_tag}"
  container_port     = 5000
  desired_count      = 1
  cpu                = 512
  memory             = 1024
  log_group_name     = module.cloudwatch.log_group_names["backend-api"]
  secret_arns        = module.secrets.secret_arns
  bucket_arns        = module.s3.bucket_arns
}

module "sagemaker" {
  source      = "../../modules/sagemaker"
  project     = var.project
  environment = var.environment
  bucket_arns = module.s3.bucket_arns
}

module "iam" {
  source              = "../../modules/iam"
  project             = var.project
  environment         = var.environment
  github_org          = var.github_org
  github_repo         = var.github_repo
  github_branch       = var.github_branch
  ecr_repository_arns = values(module.ecr.repository_arns)
  ecs_cluster_arn     = module.ecs.cluster_arn
  ecs_service_arn     = module.ecs.service_arn
}
