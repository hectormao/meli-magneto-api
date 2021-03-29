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

/**
 * IoC Container Configuration
 */

const container: Container = new Container();

const sequenceSize: number = parseInt(process.env["SEQUENCE_SIZE"] || "4");
const minFindings: number = parseInt(process.env["MIN_FINDINGS"] || "1");
const contentExpr: RegExp = new RegExp(
  process.env["CONTENT_EXPRESSION"] || "^[ATCG]+$"
);

const checkers: DNAChecker[] = [
  new HorizontalDNAChecker(sequenceSize),
  new VerticalDNAChecker(sequenceSize),
  new LeftDiagonalChecker(sequenceSize),
  new RightDiagonalChecker(sequenceSize),
];

container.bind<MagnetoMutantService>(TYPES.Service).to(MagnetoMutantService);
container
  .bind<MagnetoMutantRequestExtractor>(TYPES.Extractor)
  .to(MagnetoMutantRequestExtractor);
container.bind<DNAChecker[]>(TYPES.Checker).toConstantValue(checkers);
container.bind<DNAValidator>(TYPES.Validator).to(DNAValidator);
container.bind<number>(TYPES.SequenceSize).toConstantValue(sequenceSize);
container.bind<number>(TYPES.MinFindings).toConstantValue(minFindings);
container.bind<RegExp>(TYPES.ContentExpr).toConstantValue(contentExpr);

export default container;
