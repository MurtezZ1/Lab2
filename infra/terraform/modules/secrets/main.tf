resource "aws_secretsmanager_secret" "this" {
  for_each                = toset(var.secret_names)
  name                    = "${var.project}/${var.environment}/${each.value}"
  recovery_window_in_days = 7

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
