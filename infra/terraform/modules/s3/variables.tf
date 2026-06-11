variable "project" { type = string }
variable "environment" { type = string }
variable "name_prefix" { type = string }
variable "force_destroy" {
  type    = bool
  default = false
}
