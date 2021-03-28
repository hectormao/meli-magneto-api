import { APIGatewayProxyResult } from "aws-lambda";
import { expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, verify, when } from "ts-mockito";
import TYPES from "../../src/config/types";
import { MagnetoMutantService } from "../../src/serv/magnetoMutantService";
import { validDNAEvent, context } from "../fixtures/fixtures";
import * as status from "http-status";
import { MagnetoMutantRequestExtractor } from "../../src/extr/magnetoMutantRequestExtractor";
import { MagnetoMutantRequest } from "../../src/ent/types";
import { InvalidDNAError } from "../../src/exc/errors";

const proxyquire = require("proxyquire");

/**
 * Unit test for lambda aws handler function
 */
describe("Test Handler - Unit", async () => {
  /**
   * Test a successfully handler call
   * 1. Mock service
   * 2. Mock extractor
   * 3. Mock IoC container to return the mocks step 1 and 2
   * 4. call handler function
   * 5. check if it returns a 200 status code
   */
  it("successfully handler", async () => {
    const serviceMock = mock(MagnetoMutantService);
    const extractorMock = mock(MagnetoMutantRequestExtractor);

    when(serviceMock.isMutant(anything())).thenResolve(null);
    when(extractorMock.extractRequest(anything(), anything())).thenReturn(
      {} as MagnetoMutantRequest
    );

    const service = instance(serviceMock);
    const extractor = instance(extractorMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return extractor;
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      validDNAEvent,
      context,
      null
    );

    expect(result.statusCode).is.equals(status.OK);
    verify(extractorMock.extractRequest(anything(), anything())).once();
    verify(serviceMock.isMutant(anything())).once();
  });

  /**
   * Test a failed handler call, service raises an error
   * 1. Mock service raises an error
   * 2. Mock extractor
   * 3. Mock IoC container to return the mocks step 1 and 2
   * 4. call handler function
   * 5. check if it returns a 500 status code
   */
  it("Failed handler - service error", async () => {
    const errorMessage: string = "Test Error";
    const serviceMock = mock(MagnetoMutantService);
    const extractorMock = mock(MagnetoMutantRequestExtractor);

    when(serviceMock.isMutant(anything())).thenReject(new Error(errorMessage));
    when(extractorMock.extractRequest(anything(), anything())).thenReturn(
      {} as MagnetoMutantRequest
    );

    const service = instance(serviceMock);
    const extractor = instance(extractorMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return extractor;
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      validDNAEvent,
      context,
      null
    );
    expect(result.statusCode).is.equals(status.INTERNAL_SERVER_ERROR);
    expect(result.body).contains(errorMessage);
    verify(extractorMock.extractRequest(anything(), anything())).once();
    verify(serviceMock.isMutant(anything())).once();
  });

  /**
   * Test a failed handler call, service raises an error
   * 1. Mock service
   * 2. Mock extractor raises an error
   * 3. Mock IoC container to return the mocks step 1 and 2
   * 4. call handler function
   * 5. check if it returns a 400 status code
   */
  it("Failed handler - validation error", async () => {
    const errorMessage: string = "Test Error";
    const serviceMock = mock(MagnetoMutantService);
    const extractorMock = mock(MagnetoMutantRequestExtractor);

    when(serviceMock.isMutant(anything())).thenReject(new Error(errorMessage));
    when(extractorMock.extractRequest(anything(), anything())).thenThrow(
      new InvalidDNAError(errorMessage)
    );

    const service = instance(serviceMock);
    const extractor = instance(extractorMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return extractor;
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      validDNAEvent,
      context,
      null
    );
    expect(result.statusCode).is.equals(status.BAD_REQUEST);
    expect(result.body).contains(errorMessage);
    verify(extractorMock.extractRequest(anything(), anything())).once();
    verify(serviceMock.isMutant(anything())).never();
  });
});
