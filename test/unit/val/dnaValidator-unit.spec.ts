import { expect } from "chai";
import { describe, it } from "mocha";
import { Container } from "inversify";
import TYPES from "../../../src/config/types";
import { DNAValidator } from "../../../src/val/dnaValidator";
import {
  invalidColsDNA,
  invalidContentDNA,
  invalidRowsDNA,
  validDNA,
} from "../../fixtures/fixtures";
import { InvalidDNAError } from "../../../src/exc/errors";

/**
 * DNA validator unit tests
 */
describe("DNA Validator unit tests", async () => {
  let container: Container;

  /**
   * Preapare test environment
   * 1. set the container config
   */
  before(async () => {
    container = new Container();
    const sequenceSize: number = 4;
    const contentExpr: RegExp = new RegExp("^[ATCG]+$");
    container.bind<number>(TYPES.SequenceSize).toConstantValue(sequenceSize);
    container.bind<RegExp>(TYPES.ContentExpr).toConstantValue(contentExpr);
    container.bind<DNAValidator>(TYPES.Validator).to(DNAValidator);
  });

  /**
   * Test a valid DNA
   * 1. Get validator from container
   * 2. Call validate method
   * 3. Check if method doesn't raise an error
   */
  it("Successful Validation", async () => {
    const sut: DNAValidator = container.get(TYPES.Validator);
    sut.validate(validDNA.dna);
    expect(true).to.be.true;
  });

  /**
   * Test an invalid DNA (Content)
   * 1. Get validator from container
   * 2. Call validate method with invalid DNA
   * 3. Check if method raises an error
   */
  it("Invalid Content", async () => {
    const sut: DNAValidator = container.get(TYPES.Validator);

    expect(() => sut.validate(invalidContentDNA.dna)).to.throw(InvalidDNAError);
  });

  /**
   * Test an invalid DNA (Rows)
   * 1. Get validator from container
   * 2. Call validate method with invalid DNA
   * 3. Check if method raises an error
   */
  it("Invalid DNA Rows", async () => {
    const sut: DNAValidator = container.get(TYPES.Validator);
    expect(() => sut.validate(invalidRowsDNA.dna)).to.throw(InvalidDNAError);
  });

  /**
   * Test an invalid DNA (Cols)
   * 1. Get validator from container
   * 2. Call validate method with invalid DNA
   * 3. Check if method raises an error
   */
  it("Invalid DNA Cols", async () => {
    const sut: DNAValidator = container.get(TYPES.Validator);
    expect(() => sut.validate(invalidColsDNA.dna)).to.throw(InvalidDNAError);
  });

  /**
   * Test an invalid DNA (Null)
   * 1. Get validator from container
   * 2. Call validate method with invalid DNA
   * 3. Check if method raises an error
   */
  it("Null DNA", async () => {
    const sut: DNAValidator = container.get(TYPES.Validator);
    expect(() => sut.validate(null)).to.throw(InvalidDNAError);
  });
});
