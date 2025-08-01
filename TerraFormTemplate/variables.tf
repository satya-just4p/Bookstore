variable "aws_region"{
    default = "eu-central-1"
}

variable "angular_s3_bucket_name"{
    description = "S3 bucket name to host the Angular App"
    type = string
    default = "bookstoreprojectbucket.1981"
}

# Below is the S3 bucket name that stores the Bastion Private key
variable "bookstore_bastion_key"{
    description = "S3 bucket name that stores the bastion key private key"
    type = string
    default = "bookstore-bastion-private-key.1981"
}

variable "vpc_cidr"{
    default = "10.0.0.0/16"
}

variable "bookstore_public_subnet_cidr"{
    default = "10.0.1.0/24"
}

variable "bookstore_private_subnet_cidr"{
    default = "10.0.2.0/24"
}
variable "bookstore_private_subnet_cidr_b"{
    default = "10.0.3.0/24"
}

variable "bookstore_key_pair_name"{
    default = "bookstore-bastion-key"
}

variable "public_key_path"{
    default = "../SSH/bookstore-bastion-key.pub"
}

variable "ssm_db_username"{
    default = "bookstorewebapp"
}

variable "ssm_db_password"{
    default = "B00kstorewebapp!2025$Xy"
}

variable "ssm_db_name"{
    default = "BookstoreWebApp"
}

variable "bookstore_cicd_user_name"{
    default = "bookstore-ci-cd-angular-user"
}

