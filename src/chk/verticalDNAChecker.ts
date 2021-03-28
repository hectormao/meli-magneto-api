import { SequenceDNAChecker } from "./dnaChecker";

export class VerticalDNAChecker extends SequenceDNAChecker {
  /**
   * For Vertical an edge is when row plus sequence size is greater than array size
   * @param dna
   * @param row
   * @param col
   * @returns
   */
  public isEdge(dna: string[], row: number, col: number): boolean {
    return row + this.sequenceSize > dna.length;
  }

  /**
   * The position of char is row plus idx and col
   * @param dna
   * @param row
   * @param col
   * @param idx
   * @returns
   */
  public getChar(dna: string[], row: number, col: number, idx: number): string {
    return dna[row + idx].charAt(col);
  }
}
