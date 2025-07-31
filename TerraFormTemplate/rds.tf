resource "aws_security_group" "rds_bookstore_sg"{
    vpc_id = aws_vpc.bookstore_vpc.id
    description = "Allows Lambda to access RDS Instance"
    name = "rds-bookstore-sg"
}

resource "aws_vpc_security_group_ingress_rule" "bookstore_bastion_ingress"{
    description = "Allows Bastion Host to access RDS Instance"
    security_group_id = aws_security_group.rds_bookstore_sg.id

    from_port = 1433
    to_port = 1433
    ip_protocol = "tcp"
    referenced_security_group_id = aws_security_group.bastion_bookstore_sg.id
}

resource "aws_vpc_security_group_ingress_rule" "bookstore_lambda_ingress"{
    description = "Allows AWS Lambda access RDS Instance"
    security_group_id = aws_security_group.rds_bookstore_sg.id

    from_port = 1433
    to_port = 1433
    ip_protocol = "tcp"
    referenced_security_group_id = aws_security_group.lambda_bookstore_sg.id
}

resource "aws_db_subnet_group" "bookstore_rds_subnet_group"{
    subnet_ids = [
        aws_subnet.bookstore_private_subnet.id,
        aws_subnet.bookstore_private_subnet_b.id
    ]
    tags = {
        Name = "bookstore-rds-subnet-group"
    }
}
resource "aws_db_instance" "bookstore_db_instance"{
    identifier = "BookstoreWebApp"
    allocated_storage = 20
    engine = "sqlserver-ex"
    engine_version = "15.00.4073.23.v1"
    instance_class = "db.t3.micro"
    username = var.ssm_db_username
    password = var.ssm_db_password
    parameter_group_name = "default.sqlserver-ex-15.0"
    skip_final_snapshot = true
    publicly_accessible = false
    db_subnet_group_name = aws_db_subnet_group.bookstore_rds_subnet_group.name
    vpc_security_group_ids = [aws_security_group.rds_bookstore_sg.id]

    tags = {
        Name = "bookstore-rds"
    }
}