import requestMiddleware from "mtglm-service-sdk/build/middleware/requestResource";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";

import PlayerController from "../controllers";

const controller = new PlayerController();

module.exports.handler = requestMiddleware(
  async (): Promise<LambdaResponse> => {
    const response = await controller.getRoles();

    return response;
  }
);
