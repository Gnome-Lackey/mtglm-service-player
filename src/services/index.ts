import { AttributeMap } from "aws-sdk/clients/dynamodb";

import * as cognito from "mtglm-service-sdk/build/clients/cognito";

import { MTGLMDynamoClient } from "mtglm-service-sdk/build/clients/dynamo";

import * as mapper from "mtglm-service-sdk/build/mappers/player";

import { SuccessResponse, PlayerResponse } from "mtglm-service-sdk/build/models/Responses";
import { PlayerCreateRequest, PlayerUpdateRequest } from "mtglm-service-sdk/build/models/Requests";

import { PROPERTIES_PLAYER } from "mtglm-service-sdk/build/constants/mutable_properties";

const Sentencer = require("sentencer");

const { PLAYER_TABLE_NAME } = process.env;

const client = new MTGLMDynamoClient(PLAYER_TABLE_NAME, PROPERTIES_PLAYER);

const buildResponse = (result: AttributeMap): PlayerResponse => {
  const node = mapper.toNode(result);
  const view = mapper.toView(node);

  return {
    ...view,
    matches: node.matchIds
  };
};

export const create = async (data: PlayerCreateRequest): Promise<PlayerResponse> => {
  if (data.epithet === "[[random]]") {
    data.epithet = Sentencer.make("{{ adjective }} {{ noun }}");
  }

  const item = mapper.toCreateItem(data);

  const result = await client.create({ playerId: item.playerId }, item);

  await cognito.adminUpdateUserAttribute(data.userName, [
    {
      Name: "custom:firstTimeLogin",
      Value: "0"
    }
  ]);

  return buildResponse(result);
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
  const item = mapper.toUpdateItem(data);

  const result = await client.update({ playerId }, item);

  return buildResponse(result);
};
