import requestMiddleware from "mtglm-service-sdk/build/middleware/requestResource";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerPathParameters } from "mtglm-service-sdk/build/models/PathParameters";

import * as controller from "../controllers";

module.exports.handler = requestMiddleware(
  async (path: PlayerPathParameters): Promise<LambdaResponse> => {
    const { playerId } = path;

    const response = await controller.remove(playerId);

    return response;
  }
);
