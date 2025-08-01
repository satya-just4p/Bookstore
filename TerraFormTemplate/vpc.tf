resource "aws_vpc" "bookstore_vpc"{
    cidr_block = var.vpc_cidr

    # Below code is necessary to enable VPC's DNSHostNames and DNSSupport
    # so that VPC endpoint for SSM and Lambda can communicate with each other

    enable_dns_support = true
    enable_dns_hostnames = true

    tags = {
        Name = "bookstore-vpc"
    }
}

resource "aws_subnet" "bookstore_public_subnet"{
    vpc_id = aws_vpc.bookstore_vpc.id
    cidr_block = var.bookstore_public_subnet_cidr
    map_public_ip_on_launch = true
    availability_zone = "${var.aws_region}a"

    tags = {
        Name = "bookstore-public-subnet"
    }
}

resource "aws_subnet" "bookstore_private_subnet"{
    vpc_id = aws_vpc.bookstore_vpc.id
    cidr_block = var.bookstore_private_subnet_cidr
    map_public_ip_on_launch = false
    availability_zone = "${var.aws_region}a"

    tags = {
        Name = "bookstore-private-subnet"
    }
}

resource "aws_subnet" "bookstore_private_subnet_b"{
    vpc_id = aws_vpc.bookstore_vpc.id
    cidr_block = var.bookstore_private_subnet_cidr_b
    map_public_ip_on_launch = false
    availability_zone = "${var.aws_region}b"

    tags = {
        Name = "bookstore-private-subnet-b"
    }
}


resource "aws_internet_gateway" "bookstore_igw"{
    vpc_id = aws_vpc.bookstore_vpc.id

    tags = {
        Name = "bookstore-igw"
    }
}

resource "aws_route_table" "bookstore_public_rt"{
    vpc_id = aws_vpc.bookstore_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.bookstore_igw.id
    }

    tags = {
        Name = "bookstore-public-rt"
    }
}

resource "aws_route_table_association" "bookstore_routetable_aasoc"{
    subnet_id = aws_subnet.bookstore_public_subnet.id
    route_table_id = aws_route_table.bookstore_public_rt.id
}

# Below code creates SG for VPC Endpoint that allows Lambda function access SSM
resource "aws_security_group" "bookstore_vpc_endpoint_sg"{
    name = "bookstore-vpc-endpoint-sg"
    description = "Security Group for VPC Endpoint for SSM"
    vpc_id = aws_vpc.bookstore_vpc.id

    tags = {
        Name = "bookstore-vpc-endpoint-sg"
    }
}

resource "aws_vpc_security_group_ingress_rule" "bookstore_vpc_endpoint_ingress"{
    security_group_id = aws_security_group.bookstore_vpc_endpoint_sg.id
    description = "Allow AWS Lambda to access SSM"

    from_port = 443
    to_port = 443
    ip_protocol = "tcp"
    referenced_security_group_id = aws_security_group.lambda_bookstore_sg.id
}

# Below code creates Interface Endpoint to enable
# private connection between AWS Lambda and SSM
# standard parameter store

resource "aws_vpc_endpoint" "bookstore_ssm"{
    vpc_id = aws_vpc.bookstore_vpc.id
    service_name = "com.amazonaws.${var.aws_region}.ssm"
    vpc_endpoint_type = "Interface"
    subnet_ids = [aws_subnet.bookstore_private_subnet.id]
    security_group_ids = [aws_security_group.bookstore_vpc_endpoint_sg.id]

    private_dns_enabled = true

    tags = {
        Name = "bookstore SSM VPC Interface endpoint"
        Environment = "Dev/Test"
    }
}