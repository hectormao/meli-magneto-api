/**
 * Request Model
 */
export interface MagnetoMutantRequest {
  dna: string[];
  country: string;
  originIP: string;
}

export interface MagnetoMutantResult extends MagnetoMutantRequest {
  isMutant: boolean;
}
