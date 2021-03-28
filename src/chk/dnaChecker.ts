/**
 * Checker for a DNA Array
 */
export interface DNAChecker {
  /**
   * Method that check if a DNA Array Position has a Mutant sequence
   * @param dna array
   * @param row row podition
   * @param col col position
   */
  check(dna: string[], row: number, col: number): Promise<number>;
}

/**
 * Checker to validate if in a position of a DNA array has a sequence of the same characters
 */
export abstract class SequenceDNAChecker implements DNAChecker {
  constructor(protected readonly sequenceSize: number) {}
  /**
   * Check if a position is an edge
   * @param dna array
   * @param row array row position
   * @param col array col position
   */
  abstract isEdge(dna: string[], row: number, col: number): boolean;
  /**
   * Get the char to evaluate
   * @param dna array
   * @param row array row position
   * @param col array col position
   * @param idx index to get the char
   */
  abstract getChar(
    dna: string[],
    row: number,
    col: number,
    idx: number
  ): string;
  /**
   * Method that checks if in a position of an array has a same character sequence
   * @param dna array
   * @param row array row position
   * @param col array col position
   * @returns
   */
  public async check(dna: string[], row: number, col: number): Promise<number> {
    if (this.isEdge(dna, row, col)) {
      return 0;
    }
    const charToCheck: string = dna[row].charAt(col);
    let idx: number = 1;
    while (idx < this.sequenceSize) {
      let currentChar: string = this.getChar(dna, row, col, idx);
      if (charToCheck !== currentChar) {
        break;
      }
      idx++;
    }

    return idx >= this.sequenceSize ? 1 : 0;
  }
}
