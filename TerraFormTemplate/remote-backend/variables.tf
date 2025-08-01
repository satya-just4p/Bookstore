variable "bucket_name"{
    description = "Name of the S3 bucket for storing the terraform state"
    default = "bookstore-tfstate-bucket"
    type = string
}

variable "lock_table_name"{
    description = "Name of the Dynamodb Table for state locking"
    default = "bookstore-tfstate-lock-table"
    type = string

}

variable "environment"{
    description = "Deployment Environment (e.g. dev,prod etc)"
    default = "dev"
    type = string
}