import MTGLMLogger from "mtglm-service-sdk/build/utils/logger";
import ResponseHandler from "mtglm-service-sdk/build/utils/response";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";
import {
  PlayerCreateRequest,
  PlayerUpdateRequest,
  PlayerUpdateRoleRequest
} from "mtglm-service-sdk/build/models/Requests";

import PlayerService from "../services";

export default class PlayerController {
  private service = new PlayerService();

  private logger = new MTGLMLogger();
  private responseHandler = new ResponseHandler();

  create = async (data: PlayerCreateRequest): Promise<LambdaResponse> => {
    try {
      const result = await this.service.create(data);

      this.logger.success("DYNAMO", "POST player", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "POST player", error);

      return this.responseHandler.error(error);
    }
  };

  get = async (playerId: string): Promise<LambdaResponse> => {
    try {
      const result = await this.service.get(playerId);

      this.logger.success("DYNAMO", "GET player", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "GET player", error);

      return this.responseHandler.error(error);
    }
  };

  getRoles = async (): Promise<LambdaResponse> => {
    try {
      const result = await this.service.getRoles();

      this.logger.success("DYNAMO", "GET player roles", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "GET player roles", error);

      return this.responseHandler.error(error);
    }
  };

  query = async (queryParams: PlayerQueryParameters): Promise<LambdaResponse> => {
    try {
      const result = await this.service.query(queryParams);

      this.logger.success("DYNAMO", "GET all players", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "GET all players", error);

      return this.responseHandler.error(error);
    }
  };

  remove = async (playerId: string): Promise<LambdaResponse> => {
    try {
      const result = await this.service.remove(playerId);

      this.logger.success("DYNAMO", "DELETE player", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "DELETE player", error);

      return this.responseHandler.error(error);
    }
  };

  update = async (playerId: string, data: PlayerUpdateRequest): Promise<LambdaResponse> => {
    try {
      const result = await this.service.update(playerId, data);

      this.logger.success("DYNAMO", "PUT player", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "PUT player", error);

      return this.responseHandler.error(error);
    }
  };

  updateRole = async (playerId: string, data: PlayerUpdateRoleRequest): Promise<LambdaResponse> => {
    try {
      const result = await this.service.updateRole(playerId, data);

      this.logger.success("DYNAMO", "PUT Role player", result);

      return this.responseHandler.success(result);
    } catch (error) {
      this.logger.failure("DYNAMO", "PUT Role player", error);

      return this.responseHandler.error(error);
    }
  };
}
