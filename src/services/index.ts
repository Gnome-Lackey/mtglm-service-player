import { AdminGetUserResponse, GetUserResponse } from "aws-sdk/clients/cognitoidentityserviceprovider";

import * as client from "mtglm-service-sdk/build/clients/cognito";

import * as mapper from "mtglm-service-sdk/build/mappers/player";

import { PlayerResponse } from "mtglm-service-sdk/build/models/Responses";

function buildResponse(result: AdminGetUserResponse): PlayerResponse;
function buildResponse(result: GetUserResponse): PlayerResponse;
function buildResponse(result: any): PlayerResponse {
  const node = mapper.toNode(result);

  return mapper.toView(node);
};

export const get = async (userName: string): Promise<PlayerResponse> => {
  const result = await client.getUser(userName);

  return buildResponse(result);
};

export const query = async (): Promise<PlayerResponse[]> => {
  const results = await client.getAllUsers();

  return results.map(buildResponse);
};
