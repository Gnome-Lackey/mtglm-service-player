import requestMiddleware from "mtglm-service-sdk/build/middleware/requestResource";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerPathParameters } from "mtglm-service-sdk/build/models/PathParameters";
import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";

import * as controller from "../controllers";

module.exports.handler = requestMiddleware(
  async (
    path: PlayerPathParameters,
    data: object,
    query: PlayerQueryParameters
  ): Promise<LambdaResponse> => {
    const response = await controller.query(query);

    return response;
  }
);
