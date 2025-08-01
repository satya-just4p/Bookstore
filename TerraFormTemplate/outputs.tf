output "s3_bucket_name"{
    description = "S3 bucket Name"
    value = aws_s3_bucket.bookstore_angular_bucket.bucket
}

output "angular_cloudfront_domain_name"{
    description = "Cloudfront domain name for Angular frontend"
    value = aws_cloudfront_distribution.bookstore_angular_cdn.domain_name
}

output "lambda_function_name"{
    description = "AWS Lambda Function on which .Net Core Web API is deployed"
    value = aws_lambda_function.bookstore_lambda_function.function_name
}

output "lambda_function_url"{
    description = "Outputs lambda function Url"
    value = aws_lambda_function_url.bookstore_lambda_function_url.function_url
}
output "angular_base_api_url"{
    description = "Outputs the API Gateway URL"
    value = aws_apigatewayv2_stage.bookstore_stage.invoke_url
    sensitive = false
}
output "github_actions_role_arn"{
    description = "Outputs the role arn of Github Actions that interacts with Angular App"
    value = aws_iam_role.bookstore_github_actions_role.arn
}
output "bookstore_project_region"{
    description = "Outputs the Bookstore project region"
    value = var.aws_region
}
output "angular_cloudfront_distribution_id"{
    description = "Outputs the CloudFront Distribution Id"
    value = aws_cloudfront_distribution.bookstore_angular_cdn.id
}

output "bookstore_bastion_host_public_ip"{
    description = "Outputs the Public Ip address of Bastion Host"
    value = aws-instance.bookstore_bastion_instance.public_ip
}

output "bookstore_bastion_host_instance_id"{
    description = "Outputs the Instance Id of the Bastion Host"
    value = aws_instance.bookstore_bastion_instance.id
}

output "bookstore_rd_instance_endpoint"{
    description = "Outputs the RDS endpoint"
    value = aws_db_instance.bookstore_db_instance.address
}