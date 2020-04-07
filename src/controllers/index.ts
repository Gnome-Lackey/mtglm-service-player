import { logFailure, logSuccess } from "mtglm-service-sdk/build/utils/logger";
import { handleError, handleSuccess } from "mtglm-service-sdk/build/utils/response";

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

  async create(data: PlayerCreateRequest): Promise<LambdaResponse> {
    try {
      const result = await this.service.create(data);

      logSuccess("DYNAMO", "POST player", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "POST player", error);

      return handleError(error);
    }
  }

  async get(playerId: string): Promise<LambdaResponse> {
    try {
      const result = await this.service.get(playerId);

      logSuccess("DYNAMO", "GET player", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "GET player", error);

      return handleError(error);
    }
  }

  async getRoles(): Promise<LambdaResponse> {
    try {
      const result = await this.service.getRoles();

      logSuccess("DYNAMO", "GET player roles", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "GET player roles", error);

      return handleError(error);
    }
  }

  async query(queryParams: PlayerQueryParameters): Promise<LambdaResponse> {
    try {
      const result = await this.service.query(queryParams);

      logSuccess("DYNAMO", "GET all players", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "GET all players", error);

      return handleError(error);
    }
  }

  async remove(playerId: string): Promise<LambdaResponse> {
    try {
      const result = await this.service.remove(playerId);

      logSuccess("DYNAMO", "DELETE player", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "DELETE player", error);

      return handleError(error);
    }
  }

  async update(playerId: string, data: PlayerUpdateRequest): Promise<LambdaResponse> {
    try {
      const result = await this.service.update(playerId, data);

      logSuccess("DYNAMO", "PUT player", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "PUT player", error);

      return handleError(error);
    }
  }

  async updateRole(playerId: string, data: PlayerUpdateRoleRequest): Promise<LambdaResponse> {
    try {
      const result = await this.service.updateRole(playerId, data);

      logSuccess("DYNAMO", "PUT Role player", result);

      return handleSuccess(result);
    } catch (error) {
      logFailure("DYNAMO", "PUT Role player", error);

      return handleError(error);
    }
  }
}
