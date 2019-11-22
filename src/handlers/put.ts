import requestMiddleware from "mtglm-service-sdk/build/middleware/requestResource";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerPathParameters } from "mtglm-service-sdk/build/models/PathParameters";
import { PlayerUpdateRequest } from "mtglm-service-sdk/build/models/Requests";

import * as controller from "../controllers";

module.exports.handler = requestMiddleware(
  async (path: PlayerPathParameters, data: PlayerUpdateRequest): Promise<LambdaResponse> => {
    const { playerId } = path;

    const response = await controller.update(playerId, data);

    return response;
  }
);
