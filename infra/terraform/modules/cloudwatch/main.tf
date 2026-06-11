resource "aws_cloudwatch_log_group" "this" {
  for_each          = toset(var.log_group_names)
  name              = "/${var.project}/${var.environment}/${each.value}"
  retention_in_days = var.retention_days

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
