import { inject, injectable } from "inversify";
import { InvalidDNAError } from "../exc/errors";
import TYPES from "../config/types";

/**
 * DNA Validator
 */
@injectable()
export class DNAValidator {
  constructor(
    @inject(TYPES.SequenceSize) private readonly sequenceSize: number,
    @inject(TYPES.ContentExpr) private readonly contentExpr: RegExp
  ) {}
  /**
   * Check if the dna array is valid
   * It Raises an InvalidDNAError when the array is invalid
   * @param dna array
   */
  public validate(dna: string[]): void {
    if (!dna) {
      throw new InvalidDNAError("Invalid DNA ❌");
    }

    if (dna.length < this.sequenceSize) {
      throw new InvalidDNAError("Invalid DNA rows size: " + dna.length + " ❌");
    }

    dna.forEach((row) => {
      if (row.length != dna.length) {
        throw new InvalidDNAError(
          "Invalid DNA cols size: " + row.length + " ❌"
        );
      }

      if (!row.match(this.contentExpr)) {
        throw new InvalidDNAError("Invalid DNA value: " + row + " ❌");
      }
    });
  }
}
