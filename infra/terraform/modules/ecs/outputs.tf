output "cluster_arn" { value = aws_ecs_cluster.this.arn }
output "cluster_name" { value = aws_ecs_cluster.this.name }
output "service_arn" { value = aws_ecs_service.api.id }
output "service_name" { value = aws_ecs_service.api.name }
output "load_balancer_dns_name" { value = aws_lb.this.dns_name }
output "task_execution_role_arn" { value = aws_iam_role.task_execution.arn }
output "task_role_arn" { value = aws_iam_role.task.arn }
