import { expect } from "chai";
import { describe, it } from "mocha";
import { Container } from "inversify";
import TYPES from "../../../src/config/types";
import { anything, instance, mock, when } from "ts-mockito";
import { DNAValidator } from "../../../src/val/dnaValidator";
import { context, validDNA, validDNAEvent } from "../../fixtures/fixtures";
import { MagnetoMutantRequestExtractor } from "../../../src/extr/magnetoMutantRequestExtractor";
import { MagnetoMutantRequest } from "../../../src/ent/types";
import { InvalidDNAError } from "../../../src/exc/errors";
import { APIGatewayProxyEvent } from "aws-lambda";

/**
 * Unit tests for Extractor
 */
describe("Magneto Mutant Request Extractor", async () => {
  /**
   * Test Extract with valid DNA
   * 1. Mock validator
   * 2. Build a IoC Container
   * 3. Get extractor from container
   * 4. Call extract method
   * 5. Check if DNA array is the same of the request string
   */
  it("Successful Extract", async () => {
    const validatorMock = mock(DNAValidator);
    when(validatorMock.validate(anything())).thenReturn(null);
    const validator = instance(validatorMock);

    const container: Container = new Container();
    container.bind<DNAValidator>(TYPES.Validator).toConstantValue(validator);
    container
      .bind<MagnetoMutantRequestExtractor>(TYPES.Extractor)
      .to(MagnetoMutantRequestExtractor);

    const sut: MagnetoMutantRequestExtractor = container.get(TYPES.Extractor);
    const result: MagnetoMutantRequest = sut.extractRequest(
      validDNAEvent,
      context
    );

    expect(result.dna).to.have.members(validDNA.dna);
  });

  /**
   * Test a failed Extract
   * 1. Mock validator rasing an error
   * 2. Build a IoC Container
   * 3. Get extractor from container
   * 4. Call extract method
   * 5. Check if it raises an exception
   */
  it("Failed Extract - Validation Error", async () => {
    const errorMessage: string = "Test Error";
    const validatorMock = mock(DNAValidator);
    when(validatorMock.validate(anything())).thenThrow(
      new InvalidDNAError(errorMessage)
    );
    const validator = instance(validatorMock);

    const container: Container = new Container();
    container.bind<DNAValidator>(TYPES.Validator).toConstantValue(validator);
    container
      .bind<MagnetoMutantRequestExtractor>(TYPES.Extractor)
      .to(MagnetoMutantRequestExtractor);

    const sut: MagnetoMutantRequestExtractor = container.get(TYPES.Extractor);
    expect(() => sut.extractRequest(validDNAEvent, context)).to.throw(
      InvalidDNAError
    );
  });

  /**
   * Test a failed Extract
   * 1. Mock validator rasing an error
   * 2. Build a IoC Container
   * 3. Get extractor from container
   * 4. Call extract method
   * 5. Check if it raises an exception
   */
  it("Failed Extract - Validation Error (null dna)", async () => {
    const errorMessage: string = "Test Error";
    const validatorMock = mock(DNAValidator);
    when(validatorMock.validate(anything())).thenThrow(
      new InvalidDNAError(errorMessage)
    );
    const validator = instance(validatorMock);

    const container: Container = new Container();
    container.bind<DNAValidator>(TYPES.Validator).toConstantValue(validator);
    container
      .bind<MagnetoMutantRequestExtractor>(TYPES.Extractor)
      .to(MagnetoMutantRequestExtractor);

    const sut: MagnetoMutantRequestExtractor = container.get(TYPES.Extractor);
    expect(() =>
      sut.extractRequest({} as APIGatewayProxyEvent, context)
    ).to.throw(InvalidDNAError);
  });
});
