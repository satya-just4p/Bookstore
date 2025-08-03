# API Gateway definition
resource "aws_apigatewayv2_api" "bookstore_http_api"{
    name = "bookstore-http-api"
    protocol_type = "HTTP"

    cors_configuration{
        allow_origin = [aws_cloudfront_distribution.bookstore_angular_cdn.domain_name]
        allow_headers = ["*"]
        allow_methods = ["GET","PUT","POST","DELETE","OPTIONS"]
        expose_headers = ["*"]
        max_age = 3600
    }
}

# API Gateway Integration with AWS Lambda
resource "aws_apigatewayv2_integration" "bookstore_integration"{
    api_id = aws_apigatewayv2_api.bookstore_http_api.id
    integration_type = "AWS_PROXY"
    integration_uri = aws_lambda_function.bookstore_lambda_function.invoke_arn
    integration_method = "POST"
    payload_format_version = "2.0"
}
# API Gateway Route
resource "aws_apigatewayv2_route" "bookstore_route"{
    api_id = aws_apigatewayv2_api.bookstore_http_api.id
    route_key = "ANY /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.bookstore_integration.id}"
}

# Permissions for API Gateway to call AWS Lambda
resource "aws_lambda_permission" "bookstore_lambda_permission"{
    statement_id = "AllowAPIGatewayToInvokeLambdaFunction"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.bookstore_lambda_function.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.bookstore_http_api.execution_arn}/*/*"
}

# Deployment Stage of API Gateway
resource "aws_apigatewayv2_stage" "bookstore_stage"{
    api_id = aws_apigatewayv2_api.bookstore_http_api.id
    name = "$default"
    auto_deploy = true

    
}