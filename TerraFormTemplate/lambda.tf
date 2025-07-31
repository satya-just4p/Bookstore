data "aws_caller_identity" "current" {}

# Creating Role for AWS Lambda function

resource "aws_iam_role" "bookstore_lambda_exec_role"{
    name = "bookstore-lambda-exec-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "Allow",
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "bookstore_lambda_basic_execution_role"{
    role = aws_iam_role.bookstore_lambda_exec_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "bookstore_lambda_rds_access"{
    role = aws_iam_role.bookstore_lambda_exec_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
}
resource "aws_iam_role_policy_attachment" "bookstore_lambda_vpc_access"{
    role = aws_iam_role.bookstore_lambda_exec_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"

}

resource "aws_iam_policy" "bookstore_lambda_ssm_access"{
    name = "bookstore-lambda-ssm-access"
    description = "Allows AWS Lambda access RDS Credentials stored in SSM Standard Paramter Store"
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [{
            Sid = "SSMParameterReadAccess",
            Effect = "Allow",
            Action = ["ssm:GetParameter"],
            Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/rds/*"
        },
        {
            Sid = "KMSDecryption",
            Effect= "Allow",
            Action = ["kms:Decrypt"],
            Resource = "*",
            # For Least Privilege, replace resource from * to the Below
            # Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:key/alias/aws/ssm"
        }]
    })
}

resource "aws_iam_role_policy_attachment" "bookstore_lambda_ssm_access_policy"{
    role = aws_iam_role.bookstore_lambda_exec_role.name
    policy_arn = aws_iam_policy.bookstore_lambda_ssm_access.arn
}

# Security Group for Lambda to access RDS SG and RDS Credentials
# stored in SSM Standard Parameter store

resource "aws_security_group" "lambda_bookstore_sg"{
    vpc_id = aws_vpc.bookstore_vpc.id
    name = "lambda-bookstore-sg"
}
# Outbound Traffic to access RDS Instance
resource "aws_vpc_security_group_egress_rule" "bookstore_lambda_db_access_egress"{
    security_group_id = aws_security_group.lambda_bookstore_sg.id
    description = "Allows AWS Lambda access RDS Instance"

    from_port = 1433
    to_port = 1433
    ip_protocol = "tcp"
    referenced_security_group_id = aws_security_group.rds_bookstore_sg.id
}

# Outbound Traffic to Acess RDS Credentials stored in SSM as standard parameters
resource "aws_vpc_security_group_egress_rule" "bookstore_ssm_access_egress"{
    security_group_id = aws_security_group.lambda_bookstore_sg.id
    description = "Allows AWS Lambda access SSM"

    from_port = 443
    to_port = 443
    ip_protocol = "tcp"

    referenced_security_group_id = aws_security_group.bookstore_vpc_endpoint_sg.id
}

# Lambda Function definition starts Here
resource "aws_lambda_function" "bookstore_lambda_function"{
    function_name = "bookstore-lambda-function"
    filename = "../BookstoreWebApp/BookstoreWebApp/lambda_function_payload.zip"
    handler = "BookstoreWebApp"
    runtime = "dotnet8"
    role = aws_iam_role.bookstore_lambda_exec_role.arn
    memory_size = 1024
    timeout = 50

    vpc_config {
        subnet_ids = [aws_subnet.bookstore_private_subnet.id]
        security_group_ids = [aws_security_group.lambda_bookstore_sg.id]
    }

    environment {
        variables = {
            ASPNETCORE_ENVIRONMENT = "Development"
            CORS_ALLOWED_ORIGINS = "Here comes the domain name of the cloud distribution"
        }

    }

    depends_on = [
        aws_iam_role_policy_attachment.bookstore_lambda_basic_execution_role,
        aws_iam_role_policy_attachment.bookstore_lambda_rds_access,
        aws_iam_role_policy_attachment.bookstore_lambda_vpc_access,
        aws_iam_role_policy_attachment.bookstore_lambda_ssm_access_policy

    ]

}

# Lambda Function URL
resource "aws_lambda_function_url" "bookstore_lambda_function_url"{
    function_name = aws_lambda_function.bookstore_lambda_function.function_name
    authorization_type = "NONE"

    cors{
        allow_origins = ["*"] # for more restriction, * should be replaced with Cloud front distribution domain name
        allow_methods = ["*"]
        allow_headers = ["*"]
        max_age = 300
    }
}
