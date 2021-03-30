import { Logger } from "typescript-logging";
import { loggerFactory } from "../log/configLog";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import TYPES from "../config/types";
import { InvalidDNAError, NoMutantError } from "../exc/errors";
import { DNAChecker } from "../chk/dnaChecker";
import { MagnetoMutantRequest, MagnetoMutantResult } from "../ent/types";
import { MagnetoMutantRepo } from "../repo/magnetoMutantRepo";

const log: Logger = loggerFactory.getLogger("ProductService");

type Position = { row: number; col: number };

/**
 * Service Component to check if a DNA array is mutant or not
 * It raises these exceptions:
 * - InvalidDNAError -> when DNA is invalid
 * - NoMutantError -> when DNA is non mutant
 */
@injectable()
class MagnetoMutantService {
  constructor(
    @inject(TYPES.Checker) private readonly dnaCheckers: DNAChecker[],
    @inject(TYPES.MinFindings) private readonly minFindings: number,
    @inject(TYPES.Repository) private readonly repository: MagnetoMutantRepo
  ) {}

  public async isMutant(request: MagnetoMutantRequest): Promise<void> {
    const { dna } = request;

    log.info({
      msg: "verifying if dna is mutant  ...",
      data: { request },
    });

    let findings: number = 0;
    let pos: Position = { row: -1, col: 0 };
    while (pos.row < dna.length) {
      if (pos.row == -1 || pos.col >= dna[pos.row].length) {
        pos.col = 0;
        pos.row++;
        if (pos.row >= dna.length) {
          break;
        }
        if (dna[pos.row].length != dna.length) {
          throw new InvalidDNAError("Invalid number of DNA cols");
        }
      }
      const positionFindings: number = await this.checkPostion(pos, dna);
      findings += positionFindings;
      if (findings > this.minFindings) {
        await this.saveResult(request, true);
        log.info("DNA is a mutant 😀");
        return;
      }
      pos.col++;
    }

    log.info("DNA isn't a mutant 😭");
    await this.saveResult(request, false);
    throw new NoMutantError("DNA isn't a mutant 😭");
  }

  private async saveResult(
    request: MagnetoMutantRequest,
    isMutant: boolean
  ): Promise<void> {
    const result: MagnetoMutantResult = {
      ...request,
      isMutant,
    };
    const saveResult: boolean = await this.repository.saveDNACheck(result);
    log.debug({ msg: "Save Result ... ", data: { saveResult } });
    return null;
  }

  private async checkPostion(pos: Position, dna: string[]): Promise<number> {
    const result: number[] = await Promise.all(
      this.dnaCheckers.map((checker) => checker.check(dna, pos.row, pos.col))
    );
    return result.reduce((agg: number, cur: number) => agg + cur, 0);
  }
}

export { MagnetoMutantService };
