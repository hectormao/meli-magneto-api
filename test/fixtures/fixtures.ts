import { APIGatewayProxyEvent, Context } from "aws-lambda";

export const validDNA: any = {
  dna: ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
};
export const noMutantDNA: any = {
  dna: ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"],
};
export const invalidNoDNA: any = {};
export const invalidContentDNA: any = {
  dna: ["ATGCGA", "CAGTGC", "TTATTT", "AGXCGG", "GCGTCA", "TCACTG"],
};
export const invalidRowsDNA: any = { dna: ["ATGCGA", "CAGTGC", "TTATTT"] };
export const invalidColsDNA: any = {
  dna: ["ATGCGA", "CAGTGC", "TTATTTA", "AGXCGG", "GCGTCA", "TCACTG"],
};

export const validDNAEvent = {
  headers: {},
  body: JSON.stringify(validDNA),
} as APIGatewayProxyEvent;

export const noMutantDNAEvent = {
  headers: {},
  body: JSON.stringify(noMutantDNA),
} as APIGatewayProxyEvent;

export const invalidNoDNAEvent = {
  headers: {},
  body: JSON.stringify(invalidNoDNA),
} as APIGatewayProxyEvent;

export const invalidContentDNAEvent = {
  headers: {},
  body: JSON.stringify(invalidContentDNA),
} as APIGatewayProxyEvent;

export const invalidRowsDNAEvent = {
  headers: {},
  body: JSON.stringify(invalidRowsDNA),
} as APIGatewayProxyEvent;

export const invalidColsDNAEvent = {
  headers: {},
  body: JSON.stringify(invalidColsDNA),
} as APIGatewayProxyEvent;

export const context = {} as Context;
