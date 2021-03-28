/**
 * Ioc Types to inject components
 */
const TYPES = {
  Repository: Symbol("Repository"),
  Service: Symbol("Service"),
  Extractor: Symbol("Extractor"),
  Checker: Symbol("Checker"),
  Validator: Symbol("Validator"),
  SequenceSize: Symbol("SequenceSize"),
  ContentExpr: Symbol("ContentExpr"),
  MinFindings: Symbol("MinFindings"),
};

export default TYPES;
