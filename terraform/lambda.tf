resource "aws_lambda_function" "magneto_mutant_checker" {
  function_name    = local.function_name
  role             = aws_iam_role.magneto_mutant_checker.arn
  handler          = "./dist/src/handler.handler"
  runtime          = "nodejs12.x"
  filename         = var.lambda_package
  timeout          = 10
  publish          = true
  source_code_hash = filesha256(var.lambda_package)
  environment {
    variables = {
      SEQUENCE_SIZE      = var.sequence_size
      MIN_FINDINGS       = var.min_findings
      CONTENT_EXPRESSION = var.content_expression
    }
  }
  tags = local.common_tags
}

data "aws_caller_identity" "current" {}

data aws_api_gateway_rest_api "magneto" {
  name = "magneto-api-gateway-${var.app_env}"
}

data aws_api_gateway_resource "v1" {
  rest_api_id = data.aws_api_gateway_rest_api.magneto.id
  path        = "/magneto/api/v1"
}

resource "aws_api_gateway_resource" "mutant" {
  rest_api_id = data.aws_api_gateway_rest_api.magneto.id
  parent_id   = data.aws_api_gateway_resource.v1.id
  path_part   = "mutant"
}

module "cors" {
  source          = "github.com/squidfunk/terraform-aws-api-gateway-enable-cors"
  api_id          = data.aws_api_gateway_rest_api.magneto.id
  api_resource_id = aws_api_gateway_resource.mutant.id
}

resource "aws_api_gateway_method" "mutant_post" {
  rest_api_id      = data.aws_api_gateway_rest_api.magneto.id
  resource_id      = aws_api_gateway_resource.mutant.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "mutant" {
  rest_api_id = data.aws_api_gateway_rest_api.magneto.id
  resource_id = aws_api_gateway_method.mutant_post.resource_id
  http_method = aws_api_gateway_method.mutant_post.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.magneto_mutant_checker.invoke_arn
}

resource "aws_lambda_permission" "mutant" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.magneto_mutant_checker.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${data.aws_api_gateway_rest_api.magneto.id}/*/${aws_api_gateway_method.mutant_post.http_method}${aws_api_gateway_resource.mutant.path}"
}

resource "aws_api_gateway_deployment" "mutant" {
  depends_on = [
    aws_api_gateway_integration.mutant
  ]

  rest_api_id = data.aws_api_gateway_rest_api.magneto.id
  stage_name  = var.app_env
}

output "occre_apigateway_url" {
  value = aws_api_gateway_deployment.mutant.invoke_url
}
