import { AttributeMap } from "aws-sdk/clients/dynamodb";

import * as cognito from "mtglm-service-sdk/build/clients/cognito";

import { MTGLMDynamoClient } from "mtglm-service-sdk/build/clients/dynamo";

import * as playerMapper from "mtglm-service-sdk/build/mappers/player";
import * as queryMapper from "mtglm-service-sdk/build/mappers/query";

import { SuccessResponse, PlayerResponse } from "mtglm-service-sdk/build/models/Responses";
import { PlayerCreateRequest, PlayerUpdateRequest } from "mtglm-service-sdk/build/models/Requests";
import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";

import { PROPERTIES_PLAYER } from "mtglm-service-sdk/build/constants/mutable_properties";

const Sentencer = require("sentencer");

const { TABLE_NAME } = process.env;

const client = new MTGLMDynamoClient(TABLE_NAME, PROPERTIES_PLAYER);

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

  const result = await client.create({ playerId: item.playerId }, item);

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

  const results = await client.query(filters);
 
  return results.map(buildResponse);
};

export const get = async (playerId: string): Promise<PlayerResponse> => {
  const result = await client.fetchByKey({ playerId });

  return buildResponse(result);
};

export const remove = async (playerId: string): Promise<SuccessResponse> => {
  await client.remove({ playerId });

  return { message: "Successfully deleted player." };
};

export const update = async (
  playerId: string,
  data: PlayerUpdateRequest
): Promise<PlayerResponse> => {
  const item = playerMapper.toUpdateItem(data);

  const result = await client.update({ playerId }, item);

  return buildResponse(result);
};
