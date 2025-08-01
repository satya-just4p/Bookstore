resource "aws_security_group" "bastion_bookstore_sg"{
    vpc_id = aws_vpc.bookstore_vpc.id
    description = "SG for Bastion Host"
    name = "bastion-bookstore-sg"

    tags = {
        Name = "bastion-bookstore-sg"
    }
}

resource "aws_vpc_security_group_ingress_rule" "bookstore_ssh_access_my_ip"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows SSH access from my Laptop"

    from_port = "22"
    to_port = "22"
    ip_protocol = "tcp"
    cidr_ipv4 = "91.42.24.188/32"
}

resource "aws_vpc_security_group_ingress_rule" "bookstore_rds_access_my_ip"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows RDS access from my IP"

    from_port = 1433
    to_port = 1433
    ip_protocol = "tcp"
    referenced_security_group_id = aws_security_group.rds_bookstore_sg.id
}

# Below rule allows Ansible to access bastion host
# via port 5985

resource "aws_vpc_security_group_ingress_rule" "bookstore_ansible_access_from_GithubRunner"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows Ansible to access Bastion Host via WinRM"

    from_port = 5985
    to_port = 5985
    ip_protocol = "tcp"
    cidr_ipv4 = "0.0.0.0/0"
}

# The below rule allows Ansible to access Bastion Host
# via port 5986

resource "aws_vpc_security_group_ingress_rule" "bookstore_ansible_access_from_GithubRunner_86"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows Ansible to access Bastion Host via WinRM on port 5986"

    from_port = 5986
    to_port = 5986
    ip_protocol = "tcp"
    cidr_ipv4 = "0.0.0.0/0"
}

# RDP access from Bastion Host using my IP address

resource "aws_vpc_security_group_ingress_rule" "bookstore_rdp_access_my_ip"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows RDP Access from my IP"

    from_port = 3389
    to_port = 3389
    ip_protocol = "tcp"
    cidr_ipv4 = "91.42.24.188/32"
}

resource "aws_vpc_security_group_egress_rule" "bookstore_internet_access"{
    security_group_id = aws_security_group.bastion_bookstore_sg.id
    description = "Allows Bastion Host to access internet"

    from_port = 0
    to_port = 0
    ip_protocol = "-1"
    cidr_ipv4 = "0.0.0.0/0"
}

# RSA Key Pair Generation starts Here
resource "tls_private_key" "bookstore_bastion_key"{
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "aws_key_pair" "bookstore_bastion_keypair"{
    key_name = var.bookstore_key_pair_name
    public_key = tls_private_key.bookstore_bastion_key.public_key_openssh
}

# Below code saves the private key file to the local drive
# currently it is commented
#resource "local_file" "bookstore_private_key_pem"{
#    content = tls_private_key.bookstore_bastion_key.private_key_pem
#    filename = "${path.module}/../SSH/bookstore-bastion.key.pem"
#   file_permission = "0400"
#}

# Below code saves the private key to the S3 bucket
resource "aws_s3_bucket" "bookstore_secure_key_bucket"{
    bucket = var.bookstore_bastion_key
    force_destroy = true

    tags = {
        Name = "bookstore-bastion-private-key-storage"
    }
}
# S3 Bucket Ownership
resource "aws_s3_bucket_ownership_controls" "bookstore_bastion_object_ownership"{
    bucket = aws_s3_bucket.bookstore_secure_key_bucket.id

    rule{
        object_ownership = "BucketOwnerEnforced"
    }

    depends_on = [aws_s3_bucket.bookstore_secure_key_bucket]
}

# Blocks Public Access at the Bucket Level
resource "aws_s3_bucket_public_access_block" "bookstore_block_public_access"{
    bucket = aws_s3_bucket.bookstore_secure_key_bucket.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true

    depends_on = [aws_s3_bucket.bookstore_secure_key_bucket]
}

# Storing the bastion private key in the S3 bucket
resource "aws_s3_object" "bookstore_bastion_key_file"{
    bucket = aws_s3_bucket.bookstore_secure_key_bucket.id
    key = "bookstore-bastion-key.pem"
    content = tls_private_key.bookstore_bastion_key.private_key_pem
    content_type = "text/plain"
}

# IAM role for EC2 instance to access S3 bucket for Private key
resource "aws_iam_role" "bookstore_bastion_iam_role"{
    name = "bookstore-bastion-s3-access-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [{
            Action = "sts:AssumeRole",
            Effect = "Allow",
            Principal = {
                Service = "ec2.amazonaws.com"
            }
        }]
    })
}

# IAM Policy for the above role
resource "aws_iam_policy" "bookstore_bastion_s3_policy"{
    name = "BookstoreBastionS3AccessPolicy"
    description = "Allows Bastion Host to access S3 bucket"

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [{
            Action = ["s3:GetObject"],
            Effect = "Allow",
            Resource = "${aws_s3_bucket.bookstore_secure_key_bucket.arn}/*"
            
        }]
    })

    depends_on = [aws_s3_bucket.bookstore_secure_key_bucket]
}

# Attach the above policy to the role
resource "aws_iam_role_policy_attachment" "bookstore_bastion_s3_attach"{
    role = aws_iam_role.bookstore_bastion_iam_role.name
    policy_arn = aws_iam_policy.bookstore_bastion_s3_policy.arn
}

# IAM Policy for Bastion Host to access SSM Standard Parameter store
resource "aws_iam_policy" "bookstore_bastion_ssm_access"{
    name = "bookstore-bastion-ssm-access"
    description = "Allows Bastion Host to access RDS credentials stored in SSM Parameter Store. This will be used by Ansible"

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
        {
            Sid = "AllowsBastionHostToAccessSSMParameters",
            Action = ["ssm:GetParameter"],
            Effect = "Allow",
            Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/rds/*"
        },
        {
            Sid = "KMSDecrypt",
            Effect = "Allow",
            Action = ["kms:Decrypt"],
            Resource = "*"
            # To implement least Privilege
            # Resource = "arn:aws:kms:${var.aws_region}:${data.aws_caller_identity.current.account_id}:key/alias/aws/ssm"
        }
        ]
    })
}

# Attaching the above policy to the IAM role
resource "aws_iam_role_policy_attachment" "bookstore_bastion_ssm_policy_attach"{
    role = aws_iam_role.bookstore_bastion_iam_role.name
    policy_arn = aws_iam_policy.bookstore_bastion_ssm_access.arn
}

# EC2 Instance Profile
resource "aws_iam_instance_profile" "bookstore_bastion_instance_profile"{
    name = "bookstore-bastion-instance-profile"
    role = aws_iam_role.bookstore_bastion_iam_role.name

}

resource "aws_instance" "bookstore_bastion_instance"{
    subnet_id = aws_subnet.bookstore_public_subnet.id
    ami = "ami-030a63c7124790810"
    instance_type = "t2.micro"

    # Attaching the Instance Profile
    iam_instance_profile = aws_iam_instance_profile.bookstore_bastion_instance_profile.name

    vpc_security_group_ids = [aws_security_group.bastion_bookstore_sg.id]
    associate_public_ip_address = true
    key_name = aws_key_pair.bookstore_bastion_keypair.key_name

    # UserData Section Starts Here
    # The below commands enables WinRM on Bastion Host
    # that makes Bastion Host Ansible ready

    user_data = <<-EOF
                <powershell>
                winrm quickconfig -quite
                winrm set winrm/config/service '@{AllowUnencrypted="true"}'
                winrm set winrm/config/service/auth '@{Basic="true"}'
                netsh advfirewall firewall add rule name = "Ansible RM" dir=in action=allow protocol = TCP localport=5985
                Set-Service -Name "WinRM" -StartupType Automatic
                Start-Service -Name "WinRM"
                </powershell>
                EOF

    tags = {
        Name = "bookstore-bastion-host"
        Environment = "Dev"
        Project = "BookstoreWebApp"
    }

}