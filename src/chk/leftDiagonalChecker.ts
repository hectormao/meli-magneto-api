import { SequenceDNAChecker } from "./dnaChecker";

/**
 * Sequence Left Diagonal Checker
 */
export class LeftDiagonalChecker extends SequenceDNAChecker {
  /**
   * For Left Diagonal an edge is when col or row minus sequence size is less than zero
   * @param dna
   * @param row
   * @param col
   * @returns
   */
  isEdge(dna: string[], row: number, col: number): boolean {
    return col - this.sequenceSize < 0 || row + this.sequenceSize > dna.length;
  }
  /**
   * The position of char is row plus idx and col minus idx
   * @param dna
   * @param row
   * @param col
   * @param idx
   * @returns
   */
  getChar(dna: string[], row: number, col: number, idx: number): string {
    return dna[row + idx].charAt(col - idx);
  }
}
