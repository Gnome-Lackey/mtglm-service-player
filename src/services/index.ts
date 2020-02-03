import { AttributeMap } from "aws-sdk/clients/dynamodb";

import * as cognito from "mtglm-service-sdk/build/clients/cognito";

import { MTGLMDynamoClient } from "mtglm-service-sdk/build/clients/dynamo";

import * as playerMapper from "mtglm-service-sdk/build/mappers/player";
import * as queryMapper from "mtglm-service-sdk/build/mappers/query";

import { SuccessResponse, PlayerResponse } from "mtglm-service-sdk/build/models/Responses";
import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";
import {
  PlayerCreateRequest,
  PlayerUpdateRequest,
  PlayerUpdateRoleRequest
} from "mtglm-service-sdk/build/models/Requests";

import {
  PROPERTIES_PLAYER,
  PROPERTIES_SEASON
} from "mtglm-service-sdk/build/constants/mutable_properties";

const Sentencer = require("sentencer");

const { PLAYER_TABLE_NAME, SEASON_TABLE_NAME } = process.env;

const playerClient = new MTGLMDynamoClient(PLAYER_TABLE_NAME, PROPERTIES_PLAYER);
const seasonClient = new MTGLMDynamoClient(SEASON_TABLE_NAME, PROPERTIES_SEASON);

const buildResponse = (result: AttributeMap): PlayerResponse => {
  const node = playerMapper.toNode(result);
  const view = playerMapper.toView(node);

  return {
    ...view,
    matches: node.matchIds
  };
};

export const create = async (data: PlayerCreateRequest): Promise<PlayerResponse> => {
  const item = playerMapper.toCreateItem(data);

  if (item.epithet === "[[random]]") {
    item.epithet = Sentencer.make("{{ adjective }} {{ noun }}");
  }

  const result = await playerClient.create({ playerId: item.playerId }, item);

  await cognito.adminUpdateUserAttribute(data.userName, [
    {
      Name: "custom:firstTimeLogin",
      Value: "0"
    }
  ]);

  return buildResponse(result);
};

export const query = async (queryParams: PlayerQueryParameters): Promise<PlayerResponse[]> => {
  const filters = queryMapper.toPlayerFilters(queryParams);

  let players = await playerClient.query(filters);

  if (queryParams.season) {
    const seasons = await seasonClient.query({ seasonId: queryParams.season });

    const seasonPlayerIds = seasons[0] ? (seasons[0].playerIds as string[]) : [];

    players = players.filter((player) =>
      seasonPlayerIds.find((playerId) => playerId === player.playerId)
    );
  }

  return players.map(buildResponse);
};

export const get = async (playerId: string): Promise<PlayerResponse> => {
  const result = await playerClient.fetchByKey({ playerId });

  return buildResponse(result);
};

export const remove = async (playerId: string): Promise<SuccessResponse> => {
  await playerClient.remove({ playerId });

  return { message: "Successfully deleted player." };
};

export const update = async (
  playerId: string,
  data: PlayerUpdateRequest
): Promise<PlayerResponse> => {
  const item = playerMapper.toUpdateItem(data);

  const result = await playerClient.update({ playerId }, item);

  return buildResponse(result);
};

export const updateRole = async (
  playerId: string,
  data: PlayerUpdateRoleRequest
): Promise<PlayerResponse> => {
  const result = await playerClient.fetchByKey({ playerId });

  const userName = result.userName as string;

  await cognito.adminUpdateUserAttribute(userName, [
    {
      Name: "custom:role",
      Value: data.role
    }
  ]);

  return buildResponse(result);
};
