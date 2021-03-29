import { expect } from "chai";
import { describe, it } from "mocha";
import { RightDiagonalChecker } from "../../../src/chk/rightDiagonalChecker";

/**
 * Uni test for right diagonal DNA checker
 */
describe("Right Diagonal DNA Checker Unit Test", async () => {
  const sut: RightDiagonalChecker = new RightDiagonalChecker(4);

  /**
   * Test when the DNA has a valid sequence
   * 1. Build a valid dna array
   * 2. Call check method
   * 3. Check if method returns 1
   */
  it("valid mutant sequence", async () => {
    const dna: string[] = ["ACTGA", "CAAGT", "CTATG", "GATAC"];
    const result: number = await sut.check(dna, 0, 0);
    expect(result).is.equals(1);
  });

  /**
   * Test when the DNA has a non mutant sequence
   * 1. Build a non mutant dna array
   * 2. Call check method
   * 3. Check if method returns 0
   */
  it("invalid mutant sequence", async () => {
    const dna: string[] = ["ACTGA", "CAAGT", "CTATG", "GATGC"];
    const result: number = await sut.check(dna, 0, 0);
    expect(result).is.equals(0);
  });

  /**
   * Test when the position in the DNA is an edge
   * 1. Build a valid mutant dna array
   * 2. Call check method setting position in col 2
   * 3. Check if method returns 0
   */
  it("edge case mutant sequence", async () => {
    const dna: string[] = ["ACTGA", "CAAGT", "CTATG", "GATAC"];
    const result: number = await sut.check(dna, 0, 2);
    expect(result).is.equals(0);
  });
});
