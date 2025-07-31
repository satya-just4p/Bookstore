terraform{
    backend "s3"{
        bucket = "bookstore-tfstate-bucket"
        key = "terraform.tfstate"
        region = "eu-central-1"
        dynamodb_table = "bookstore-tfstate-lock-table"
    }
}