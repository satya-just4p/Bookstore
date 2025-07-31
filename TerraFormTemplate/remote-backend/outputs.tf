output "remote_state_bucket_name"{
    description = "Name of the S3 bucket that stores the Terraform State"
    value = aws_s3_bucket.tf_state_bucket.id
}

output "remote_state_lock_table"{
    description = "Name of the Dynamodb Table used for locking"
    value = aws_dynamodb_table.tf_lock_table.name
}