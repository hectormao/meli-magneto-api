/**
 * Ioc Types to inject components
 */
const TYPES = {
  Repository: Symbol("Repository"),
  DbClient: Symbol("DbClient"),
  DNATable: Symbol("DNATable"),
  StatsTable: Symbol("StatsTable"),
  Service: Symbol("Service"),
  Extractor: Symbol("Extractor"),
  Checker: Symbol("Checker"),
  Validator: Symbol("Validator"),
  SequenceSize: Symbol("SequenceSize"),
  ContentExpr: Symbol("ContentExpr"),
  MinFindings: Symbol("MinFindings"),
};

export default TYPES;
