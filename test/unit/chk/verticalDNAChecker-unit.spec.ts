import { expect } from "chai";
import { describe, it } from "mocha";
import { VerticalDNAChecker } from "../../../src/chk/verticalDNAChecker";

/**
 * Uni test for verical DNA checker
 */
describe("Vertical DNA Checker Unit Test", async () => {
  const sut: VerticalDNAChecker = new VerticalDNAChecker(4);

  /**
   * Test when the DNA has a valid sequence
   * 1. Build a valid dna array
   * 2. Call check method
   * 3. Check if method returns 1
   */
  it("valid mutant sequence", async () => {
    const dna: string[] = ["A", "A", "A", "A", "C"];
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
    const dna: string[] = ["A", "A", "C", "A", "C"];
    const result: number = await sut.check(dna, 0, 0);
    expect(result).is.equals(0);
  });

  /**
   * Test when the position in the DNA is an edge
   * 1. Build a valid mutant dna array
   * 2. Call check method setting position in row 2
   * 3. Check if method returns 0
   */
  it("edge case mutant sequence", async () => {
    const dna: string[] = ["A", "A", "A", "A", "C"];
    const result: number = await sut.check(dna, 2, 0);
    expect(result).is.equals(0);
  });
});
