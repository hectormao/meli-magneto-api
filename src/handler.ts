import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { Logger } from "typescript-logging";
import { loggerFactory } from "./log/configLog";
import container from "./config/inversify.config";
import TYPES from "./config/types";
import * as status from "http-status";
import { MagnetoMutantService } from "./serv/magnetoMutantService";
import { MagnetoMutantRequestExtractor } from "./extr/magnetoMutantRequestExtractor";
import { MagnetoMutantRequest } from "./ent/types";

const log: Logger = loggerFactory.getLogger("handler");
/**
 * API Gateway Event Handler for Magneto Mutant Checker
 * @param event API Gateway Event
 * @param context AWS Call Context
 * @returns APIGatewayProxyResult with 200 code when dna is mutant 403 when dna is not mutant 400 when dna is invalid 500 when it produces an Unexpected Exception
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  log.info({ msg: "Receiving API Gateway event", data: { event, context } });
  try {
    const extractor: MagnetoMutantRequestExtractor = container.get(
      TYPES.Extractor
    );
    const service: MagnetoMutantService = container.get(TYPES.Service);

    const request: MagnetoMutantRequest = extractor.extractRequest(
      event,
      context
    );
    await service.isMutant(request);
    const result: any = {
      code: status.OK,
      message: "DNA is a mutant 😀",
    };
    return {
      statusCode: status.OK,
      body: JSON.stringify(result),
    } as APIGatewayProxyResult;
  } catch (error) {
    log.error("Error processing dna ...", error);
    const statusCode: number = error.status || status.INTERNAL_SERVER_ERROR;
    const body: any = {
      code: statusCode,
      message: error.message,
    };
    return {
      statusCode: error.status || status.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(body),
    } as APIGatewayProxyResult;
  }
};
