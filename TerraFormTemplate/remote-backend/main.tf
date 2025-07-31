resource "aws_s3_bucket" "tf_state_bucket"{
    bucket = var.bucket_name

    force_destroy = true

    tags ={
        Name = "Bookstore Terraform State Bucket"
        Environment = var.environment
    }
}

# Dynamodb Table creation for Terraform state
# Default billing mode is provisioned
# read_capacity must be atleast 1 when Billing_mode = provisioned
# write_capacity must be atleast 1 when billing_mode is provisioned

resource "aws_dynamodb_table" "tf_lock_table"{
    name = var.lock_table_name
    biiling_mode = "PAY_PER_REQUEST"

    hash_key = "LockID"

    attribute{
        name = "LockID"
        type = "S"
    }
    tags={
        Name = "Terraform lock Table"
        Environment = var.environment
    }
}