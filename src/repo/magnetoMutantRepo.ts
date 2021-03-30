import { DynamoDB } from "aws-sdk";
import {
  PutItemInput,
  PutItemOutput,
  UpdateItemInput,
  UpdateItemOutput,
} from "aws-sdk/clients/dynamodb";
import { inject, injectable } from "inversify";
import { Logger } from "typescript-logging";
import TYPES from "../config/types";
import { MagnetoMutantResult } from "../ent/types";
import { loggerFactory } from "../log/configLog";

const log: Logger = loggerFactory.getLogger("repository");

@injectable()
export class MagnetoMutantRepo {
  constructor(
    @inject(TYPES.DbClient) private readonly client: DynamoDB,
    @inject(TYPES.DNATable) private readonly dnaTable: string,
    @inject(TYPES.StatsTable) private readonly statsTable: string
  ) {}

  public async saveDNACheck(
    checkerResult: MagnetoMutantResult
  ): Promise<boolean> {
    log.info({ msg: "Saving DNA check result in DB", data: { checkerResult } });

    const dnaString: string = checkerResult.dna.reduce(
      (agg: string, cur: string) => agg.concat(cur),
      ""
    );

    const dbObject: any = {
      ...checkerResult,
      dnaString,
    };
    const params: PutItemInput = {
      TableName: this.dnaTable,
      Item: DynamoDB.Converter.marshall(dbObject),
      ConditionExpression: "attribute_not_exists(dnaString)",
    };

    const updateExpression: string = checkerResult.isMutant
      ? "SET countMutantDNA = countMutantDNA + :inc"
      : "SET countHumanDNA = countHumanDNA + :inc";
    const statParam: UpdateItemInput = {
      TableName: this.statsTable,
      Key: { statName: { S: "mutant_stats" } },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ":inc": { N: "1" },
      },
    };

    try {
      const putResult: PutItemOutput = await this.client
        .putItem(params)
        .promise();
      log.debug({ msg: "PutItemOutput", data: { putResult } });
      const updateResult: UpdateItemOutput = await this.client
        .updateItem(statParam)
        .promise();
      log.debug({ msg: "UpdateItemOutput", data: { updateResult } });
      return true;
    } catch (error) {
      log.error(
        "Error registering DNA and Stats... The stats can't be updated",
        error
      );
      return false;
    }
  }
}
