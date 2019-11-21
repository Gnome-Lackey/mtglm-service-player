import { logFailure, logSuccess } from "mtglm-service-sdk/build/utils/logger";
import { handleError, handleSuccess } from "mtglm-service-sdk/build/utils/response";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";

import * as service from "../services";

export const get = async (playerId: string): Promise<LambdaResponse> => {
  try {
    const result = await service.get(playerId);

    logSuccess("DYNAMO", "GET player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "GET player", error);

    return handleError(error);
  }
};

export const query = async (): Promise<LambdaResponse> => {
  try {
    const result = await service.query();

    logSuccess("DYNAMO", "GET player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "GET player", error);

    return handleError(error);
  }
};
