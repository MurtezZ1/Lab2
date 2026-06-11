variable "project" { type = string }
variable "environment" { type = string }
variable "aws_region" { type = string }
variable "vpc_id" { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "container_image" { type = string }
variable "container_port" {
  type    = number
  default = 5000
}
variable "desired_count" {
  type    = number
  default = 1
}
variable "cpu" {
  type    = number
  default = 512
}
variable "memory" {
  type    = number
  default = 1024
}
variable "log_group_name" { type = string }
variable "secret_arns" { type = map(string) }
variable "bucket_arns" { type = map(string) }
