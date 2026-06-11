variable "project" { type = string }
variable "environment" { type = string }
variable "log_group_names" { type = list(string) }
variable "retention_days" {
  type    = number
  default = 30
}
