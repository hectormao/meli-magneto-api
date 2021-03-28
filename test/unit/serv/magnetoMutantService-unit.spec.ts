import { expect } from "chai";
import { Container } from "inversify";
import { describe, it } from "mocha";
import { DNAChecker } from "../../../src/chk/dnaChecker";
import TYPES from "../../../src/config/types";
import { MagnetoMutantRequest } from "../../../src/ent/types";
import { NoMutantError } from "../../../src/exc/errors";
import { MagnetoMutantService } from "../../../src/serv/magnetoMutantService";

/**
 * Unit tests for Magneto Mutant Service
 */
describe("Magneto Mutant Service Unit Tests", async () => {
  /**
   * Test a Mutant DNA
   * 1. Mock DNA checkers returning 1
   * 2. Build a valid IoC container
   * 3. Get the service from container
   * 4. Call isMutant method
   * 5. Check if it doesn raise an error
   */
  it("Mutant DNA", async () => {
    const checkers: DNAChecker[] = [
      {
        check: async (dna: string[], row: number, col: number) => 1,
      } as DNAChecker,
    ];

    const container: Container = new Container();
    container.bind<DNAChecker[]>(TYPES.Checker).toConstantValue(checkers);
    container.bind<number>(TYPES.MinFindings).toConstantValue(1);
    container
      .bind<MagnetoMutantService>(TYPES.Service)
      .to(MagnetoMutantService);

    const sut: MagnetoMutantService = container.get(TYPES.Service);

    const request: MagnetoMutantRequest = {
      dna: ["AAAA", "CCCC", "TTTT", "GGGG"],
    };

    await sut.isMutant(request);
    expect(true).is.true;
  });

  /**
   * Test a No Mutant DNA
   * 1. Mock DNA checkers returning 0
   * 2. Build a valid IoC container
   * 3. Get the service from container
   * 4. Call isMutant method
   * 5. Check if it raises a NoMutantError
   */
  it("No Mutant DNA", async () => {
    const checkers: DNAChecker[] = [
      {
        check: async (dna: string[], row: number, col: number) => 0,
      } as DNAChecker,
    ];

    const container: Container = new Container();
    container.bind<DNAChecker[]>(TYPES.Checker).toConstantValue(checkers);
    container.bind<number>(TYPES.MinFindings).toConstantValue(1);
    container
      .bind<MagnetoMutantService>(TYPES.Service)
      .to(MagnetoMutantService);

    const sut: MagnetoMutantService = container.get(TYPES.Service);

    const request: MagnetoMutantRequest = {
      dna: ["AAAA", "CCCC", "TTTT", "GGGG"],
    };
    try {
      await sut.isMutant(request);
      expect.fail("Test must raise an exception");
    } catch (error) {
      expect(error).to.be.an.instanceof(NoMutantError);
    }
  });
});