import * as AWS from "aws-sdk-mock";
import { DynamoDB, Request } from "aws-sdk";
import { PutItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Container } from "inversify";
import { anything, instance, mock, verify, when } from "ts-mockito";
import TYPES from "../../../src/config/types";
import { MagnetoMutantResult } from "../../../src/ent/types";
import { MagnetoMutantRepo } from "../../../src/repo/magnetoMutantRepo";
import { MagnetoMutantService } from "../../../src/serv/magnetoMutantService";
import { expect } from "chai";

/**
 * Unit tests for Magneto Mutant Service
 */
describe("Magneto Mutant Repository Unit Tests", async () => {
  /**
   * Test a Successful repo call
   * 1. Mock DynamoDB Client
   * 2. Build a valid IoC container
   * 3. Get the reposotiry from container
   * 4. Call saveDNACheck method
   * 5. Check if it call dynamodb client methods
   */
  it("Successful call", async () => {
    let putItemCalled: boolean = false;
    let updateItemCalled: boolean = false;

    AWS.mock("DynamoDB", "putItem", function (params, callback) {
      putItemCalled = true;
      callback(null, "successfully put item in database");
    });

    AWS.mock("DynamoDB", "updateItem", function (params, callback) {
      updateItemCalled = true;
      callback(null, "successfully update item in database");
    });

    const dynamoClient = new DynamoDB();
    const container = new Container();
    container.bind<string>(TYPES.DNATable).toConstantValue("dna_unit_test");
    container.bind<string>(TYPES.StatsTable).toConstantValue("stats_unit_test");
    container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
    container.bind<MagnetoMutantRepo>(TYPES.Repository).to(MagnetoMutantRepo);

    const check: MagnetoMutantResult = {
      isMutant: true,
      dna: [],
      country: "TST",
      originIP: "127.0.0.1",
    };
    const sut: MagnetoMutantRepo = container.get(TYPES.Repository);

    await sut.saveDNACheck(check);

    expect(putItemCalled).is.true;
    expect(updateItemCalled).is.true;

    AWS.restore("DynamoDB");
  });

  /**
   * Test a Failed DynamoDB call
   * 1. Mock DynamoDB Client
   * 2. Build a valid IoC container
   * 3. Get the reposotiry from container
   * 4. Call saveDNACheck method
   * 5. Check if it call dynamodb client methods
   */
  it("Failed dynamodb call", async () => {
    let putItemCalled: boolean = false;
    let updateItemCalled: boolean = false;

    AWS.mock("DynamoDB", "putItem", function (params, callback) {
      putItemCalled = true;
      callback(new Error("Test Error"), false);
    });

    AWS.mock("DynamoDB", "updateItem", function (params, callback) {
      updateItemCalled = true;
      callback(null, "successfully update item in database");
    });

    const dynamoClient = new DynamoDB();
    const container = new Container();
    container.bind<string>(TYPES.DNATable).toConstantValue("dna_unit_test");
    container.bind<string>(TYPES.StatsTable).toConstantValue("stats_unit_test");
    container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
    container.bind<MagnetoMutantRepo>(TYPES.Repository).to(MagnetoMutantRepo);

    const check: MagnetoMutantResult = {
      isMutant: true,
      dna: [],
      country: "TST",
      originIP: "127.0.0.1",
    };
    const sut: MagnetoMutantRepo = container.get(TYPES.Repository);

    await sut.saveDNACheck(check);

    expect(putItemCalled).is.true;
    expect(updateItemCalled).is.false;

    AWS.restore("DynamoDB");
  });
});
