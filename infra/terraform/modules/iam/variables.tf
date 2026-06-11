variable "project" { type = string }
variable "environment" { type = string }
variable "github_org" { type = string }
variable "github_repo" { type = string }
variable "github_branch" {
  type    = string
  default = "main"
}
variable "ecr_repository_arns" { type = list(string) }
variable "ecs_cluster_arn" { type = string }
variable "ecs_service_arn" { type = string }
