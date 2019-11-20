import requestMiddleware from "mtglm-service-sdk/build/middleware/request";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerPathParameters } from "mtglm-service-sdk/build/models/PathParameters";
import { PlayerCreateRequest } from "mtglm-service-sdk/build/models/Requests";

import * as controller from "../controllers";

module.exports.handler = requestMiddleware(
  async (path: PlayerPathParameters, data: PlayerCreateRequest): Promise<LambdaResponse> => {
    const response = await controller.create(data);

    return response;
  }
);
