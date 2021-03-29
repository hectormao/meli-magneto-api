import { SequenceDNAChecker } from "./dnaChecker";

/**
 * Right Diagonal Sequence Checker
 */
export class RightDiagonalChecker extends SequenceDNAChecker {
  /**
   * For Right diagonal en edge is when col or row plus sequence size is greater than array size
   * @param dna
   * @param row
   * @param col
   * @returns
   */
  isEdge(dna: string[], row: number, col: number): boolean {
    return (
      col + this.sequenceSize > dna[row].length ||
      row + this.sequenceSize > dna.length
    );
  }
  /**
   * The position of char is row plus idx and col plus idx
   * @param dna
   * @param row
   * @param col
   * @param idx
   * @returns
   */
  getChar(dna: string[], row: number, col: number, idx: number): string {
    return dna[row + idx].charAt(col + idx);
  }
}
