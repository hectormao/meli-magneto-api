import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "./handler";

const contextMock: Context = {
  callbackWaitsForEmptyEventLoop: null,
  functionName: null,
  functionVersion: null,
  invokedFunctionArn: null,
  memoryLimitInMB: null,
  awsRequestId: null,
  logGroupName: null,
  logStreamName: null,
  getRemainingTimeInMillis: null,
  done: null,
  fail: null,
  succeed: null,
};

/*const dna: string[] = [
  "ATGCGA",
  "CAGTGC",
  "TTATGT",
  "AGAAGG",
  "CCCCTA",
  "TCACTG",
];*/

const dna: string[] = [
  "ATGCGA",
  "CAGTGC",
  "TTATTT",
  "AGXCGG",
  "GCGTCA",
  "TCACTG",
];

const request = { dna };

const eventMock = {
  body: JSON.stringify(request),
} as APIGatewayProxyEvent;

const resultPromise: Promise<APIGatewayProxyResult> = handler(
  eventMock,
  contextMock,
  null
) as Promise<APIGatewayProxyResult>;
resultPromise.then(
  (result) => console.log(result),
  (error) => console.error(error)
);
