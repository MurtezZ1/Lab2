output "backend_ecr_repository_url" {
  value = module.ecr.repository_urls["backend-api"]
}

output "backend_url" {
  value = "http://${module.ecs.load_balancer_dns_name}"
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "ml_bucket_names" {
  value = module.s3.bucket_names
}

output "sagemaker_execution_role_arn" {
  value = module.sagemaker.execution_role_arn
}

output "github_actions_role_arn" {
  value = module.iam.github_actions_role_arn
}
