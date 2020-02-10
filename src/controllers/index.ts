import { logFailure, logSuccess } from "mtglm-service-sdk/build/utils/logger";
import { handleError, handleSuccess } from "mtglm-service-sdk/build/utils/response";

import { LambdaResponse } from "mtglm-service-sdk/build/models/Lambda";
import { PlayerCreateRequest, PlayerUpdateRequest, PlayerUpdateRoleRequest } from "mtglm-service-sdk/build/models/Requests";

import * as service from "../services";
import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";

export const create = async (data: PlayerCreateRequest): Promise<LambdaResponse> => {
  try {
    const result = await service.create(data);

    logSuccess("DYNAMO", "POST player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "POST player", error);

    return handleError(error);
  }
};

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

export const getRoles = async (): Promise<LambdaResponse> => {
  try {
    const result = await service.getRoles();

    logSuccess("DYNAMO", "GET player roles", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "GET player roles", error);

    return handleError(error);
  }
};

export const query = async (queryParams: PlayerQueryParameters): Promise<LambdaResponse> => {
  try {
    const result = await service.query(queryParams);

    logSuccess("DYNAMO", "GET all players", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "GET all players", error);

    return handleError(error);
  }
};

export const remove = async (playerId: string): Promise<LambdaResponse> => {
  try {
    const result = await service.remove(playerId);

    logSuccess("DYNAMO", "DELETE player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "DELETE player", error);

    return handleError(error);
  }
};

export const update = async (
  playerId: string,
  data: PlayerUpdateRequest
): Promise<LambdaResponse> => {
  try {
    const result = await service.update(playerId, data);

    logSuccess("DYNAMO", "PUT player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "PUT player", error);

    return handleError(error);
  }
};

export const updateRole = async (
  playerId: string,
  data: PlayerUpdateRoleRequest
): Promise<LambdaResponse> => {
  try {
    const result = await service.updateRole(playerId, data);

    logSuccess("DYNAMO", "PUT Role player", result);

    return handleSuccess(result);
  } catch (error) {
    logFailure("DYNAMO", "PUT Role player", error);

    return handleError(error);
  }
};
