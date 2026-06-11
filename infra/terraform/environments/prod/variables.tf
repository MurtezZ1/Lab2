variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "project" {
  type    = string
  default = "electronic-shop-online"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "bucket_name_prefix" {
  description = "Must be globally unique across AWS."
  type        = string
}

variable "github_org" { type = string }
variable "github_repo" { type = string }

variable "github_branch" {
  type    = string
  default = "main"
}

variable "availability_zones" {
  type    = list(string)
  default = ["eu-central-1a", "eu-central-1b"]
}

variable "vpc_cidr" {
  type    = string
  default = "10.30.0.0/16"
}

variable "enable_nat_gateway" {
  type    = bool
  default = true
}

variable "backend_image_tag" {
  type    = string
  default = "latest"
}
