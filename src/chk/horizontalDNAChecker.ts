import { SequenceDNAChecker } from "./dnaChecker";

/**
 * Sequence Horizontal Checker
 */
export class HorizontalDNAChecker extends SequenceDNAChecker {
  /**
   * For Horizontal Checker and edge is if the add of col with sequence size is greather than col size
   * @param dna
   * @param row
   * @param col
   * @returns
   */
  public isEdge(dna: string[], row: number, col: number): boolean {
    return col + this.sequenceSize > dna[row].length;
  }

  /**
   * For horizontal checker we need to get the char if the cols
   * @param dna
   * @param row
   * @param col
   * @param idx
   * @returns
   */
  public getChar(dna: string[], row: number, col: number, idx: number): string {
    return dna[row].charAt(col + idx);
  }
}
