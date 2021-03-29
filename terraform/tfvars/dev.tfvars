app_id = "meli-magneto-api"
app_env = "dev"
region = "us-east-1"
s3_tf = "meli-tfstate"
lambda_package = "../meli-magneto-api.zip"
sequence_size = 4
min_findings = 1
content_expression = "^[ATCG]+$"