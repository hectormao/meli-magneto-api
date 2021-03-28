import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { MagnetoMutantRequest } from "../ent/types";
import { DNAValidator } from "../val/dnaValidator";

/**
 * DNA request extractor from API Gateway Event and context
 */
@injectable()
export class MagnetoMutantRequestExtractor {
  constructor(
    @inject(TYPES.Validator) private readonly validator: DNAValidator
  ) {}
  /**
   * Build a MagnetoMutantRequest from API Gateway Event and Context
   * This method validates the DNA array too
   * @param event API Gateway Event
   * @param context Call Context
   * @returns MagnetoMutantRequest object
   */
  public extractRequest(
    event: APIGatewayProxyEvent,
    context: Context
  ): MagnetoMutantRequest {
    const body: string = event.body ? event.body : "{}";
    const { dna } = JSON.parse(body);
    this.validator.validate(dna);
    return { dna } as MagnetoMutantRequest;
  }
}
