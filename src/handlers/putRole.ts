import requestMiddleware from "mtglm-service-sdk/build/middleware/requestResource";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerPathParameters } from "mtglm-service-sdk/build/models/PathParameters";
import { PlayerUpdateRoleRequest } from "mtglm-service-sdk/build/models/Requests";

import * as controller from "../controllers";

module.exports.handler = requestMiddleware(
  async (path: PlayerPathParameters, data: PlayerUpdateRoleRequest): Promise<LambdaResponse> => {
    const { playerId } = path;

    const response = await controller.updateRole(playerId, data);

    return response;
  }
);
