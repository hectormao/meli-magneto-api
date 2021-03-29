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

// mutant
/*const dna: string[] = [
  "ATGCGA",
  "CAGTGC",
  "TTATGT",
  "AGAAGG",
  "CCCCTA",
  "TCACTG",
];*/

// no mutant
const dna: string[] = [
  "ATGCAA",
  "CAGTGC",
  "TTATGT",
  "AGAAGG",
  "ACCCTA",
  "TCACTG",
];

const request = { dna };

const eventMock = {
  headers: {},
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
