process.env["SEQUENCE_SIZE"] = "4";
process.env["MIN_FINDINGS"] = "1";
process.env["CONTENT_EXPRESSION"] = "^[ATCG]+$";
process.env["DNA_TABLE"] = "dna-integ-test";
process.env["STATS_TABLE"] = "magneto-stats-integ-test";

import * as AWS from "aws-sdk-mock";

AWS.mock("DynamoDB", "putItem", function (params, callback) {
  callback(null, "successfully put item in database");
});

AWS.mock("DynamoDB", "updateItem", function (params, callback) {
  callback(null, "successfully update item in database");
});

import { APIGatewayProxyResult } from "aws-lambda";
import { expect } from "chai";
import { describe, it } from "mocha";
import { handler } from "../../src/handler";
import {
  context,
  invalidContentDNAEvent,
  noMutantDNAEvent,
  validDNAEvent,
} from "../fixtures/fixtures";
import * as status from "http-status";

/**
 * Integration Test for Magneto Mutant Checker
 */
describe("Magneto Mutant Checker Integration Test", async () => {
  after(async () => {
    AWS.restore("DynamoDB");
  });

  /**
   * Check a mutant DNA
   * 1. Build a Mutant Request
   * 2. Call handler method
   * 3. Chack if the response status is 200
   */
  it("Check a Mutant DNA", async () => {
    const result: APIGatewayProxyResult | void = await handler(
      validDNAEvent,
      context,
      null
    );
    expect(result).is.not.null;
    const validResult = result as APIGatewayProxyResult;
    expect(validResult.statusCode).is.equals(status.OK);
  });

  /**
   * Check a non mutant DNA
   * 1. Build a non mutant Request
   * 2. Call handler method
   * 3. Chack if the response status is 403
   */
  it("Check a Non Mutant DNA", async () => {
    const result: APIGatewayProxyResult | void = await handler(
      noMutantDNAEvent,
      context,
      null
    );
    expect(result).is.not.null;
    const validResult = result as APIGatewayProxyResult;
    expect(validResult.statusCode).is.equals(status.FORBIDDEN);
  });

  /**
   * Check an invalid DNA
   * 1. Build an invalid DNA Request
   * 2. Call handler method
   * 3. Chack if the response status is 400
   */
  it("Check an Invalid DNA", async () => {
    const result: APIGatewayProxyResult | void = await handler(
      invalidContentDNAEvent,
      context,
      null
    );
    expect(result).is.not.null;
    const validResult = result as APIGatewayProxyResult;
    expect(validResult.statusCode).is.equals(status.BAD_REQUEST);
  });
});
