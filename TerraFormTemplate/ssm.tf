resource "aws_ssm_parameter" "db_host"{
    name = "/rds/host"
    type = SecureString
    value = aws_db_instance.bookstore_db_instance.address
    tier = "Standard"
}
resource "aws_ssm_parameter" "db_name"{
    name = "/rds/name"
    type = SecureString
    value = var.ssm_db_name
    tier = "Standard"
}

resource "aws_ssm_parameter" "db_username"{
    name = "/rds/username"
    type = SecureString
    value = var.ssm_db_username
    tier = "Standard"
}

resource "aws_ssm_parameter" "db_password"{
    name = "/rds/password"
    type = SecureString
    value = var.ssm_db_password
    tier = "Standard"
}