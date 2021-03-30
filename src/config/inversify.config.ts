import { Container } from "inversify";
import TYPES from "./types";
import { MagnetoMutantService } from "../serv/magnetoMutantService";
import { DNAChecker } from "../chk/dnaChecker";
import { HorizontalDNAChecker } from "../chk/horizontalDNAChecker";
import { VerticalDNAChecker } from "../chk/verticalDNAChecker";
import { RightDiagonalChecker } from "../chk/rightDiagonalChecker";
import { LeftDiagonalChecker } from "../chk/leftDiagonalChecker";
import { DNAValidator } from "../val/dnaValidator";
import { MagnetoMutantRequestExtractor } from "../extr/magnetoMutantRequestExtractor";
import { DynamoDB, config } from "aws-sdk";
import { MagnetoMutantRepo } from "../repo/magnetoMutantRepo";

/**
 * IoC Container Configuration
 */

const container: Container = new Container();

const sequenceSize: number = parseInt(process.env["SEQUENCE_SIZE"] || "4");
const minFindings: number = parseInt(process.env["MIN_FINDINGS"] || "1");
const contentExpr: RegExp = new RegExp(
  process.env["CONTENT_EXPRESSION"] || "^[ATCG]+$"
);

const dnaTable: string = process.env["DNA_TABLE"] || "dna-dev";
const statsTable: string = process.env["STATS_TABLE"] || "magneto-stats-dev";

config.update({
  region: process.env["AWS_REGION"] || "us-east-1",
});
const dynamoClient: DynamoDB = new DynamoDB();

const checkers: DNAChecker[] = [
  new HorizontalDNAChecker(sequenceSize),
  new VerticalDNAChecker(sequenceSize),
  new LeftDiagonalChecker(sequenceSize),
  new RightDiagonalChecker(sequenceSize),
];

container.bind<MagnetoMutantRepo>(TYPES.Repository).to(MagnetoMutantRepo);
container.bind<MagnetoMutantService>(TYPES.Service).to(MagnetoMutantService);
container
  .bind<MagnetoMutantRequestExtractor>(TYPES.Extractor)
  .to(MagnetoMutantRequestExtractor);
container.bind<DNAChecker[]>(TYPES.Checker).toConstantValue(checkers);
container.bind<DNAValidator>(TYPES.Validator).to(DNAValidator);
container.bind<number>(TYPES.SequenceSize).toConstantValue(sequenceSize);
container.bind<string>(TYPES.DNATable).toConstantValue(dnaTable);
container.bind<string>(TYPES.StatsTable).toConstantValue(statsTable);
container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
container.bind<number>(TYPES.MinFindings).toConstantValue(minFindings);
container.bind<RegExp>(TYPES.ContentExpr).toConstantValue(contentExpr);

export default container;
