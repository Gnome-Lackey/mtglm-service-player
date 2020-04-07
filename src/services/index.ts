import { AttributeMap } from "aws-sdk/clients/dynamodb";

import MTGLMCognitoClient from "mtglm-service-sdk/build/clients/cognito";
import MTGLMDynamoClient from "mtglm-service-sdk/build/clients/dynamo";

import PlayerMapper from "mtglm-service-sdk/build/mappers/player";
import SeasonMapper from "mtglm-service-sdk/build/mappers/season";

import { PlayerQueryParameters } from "mtglm-service-sdk/build/models/QueryParameters";
import {
  SuccessResponse,
  PlayerResponse,
  PlayerRoleResponse
} from "mtglm-service-sdk/build/models/Responses";
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

export default class PlayerService {
  private PLAYER_TABLE_NAME = process.env.PLAYER_TABLE_NAME;
  private SEASON_TABLE_NAME = process.env.SEASON_TABLE_NAME;

  private playerClient = new MTGLMDynamoClient(this.PLAYER_TABLE_NAME, PROPERTIES_PLAYER);
  private seasonClient = new MTGLMDynamoClient(this.SEASON_TABLE_NAME, PROPERTIES_SEASON);
  private cognitoClient = new MTGLMCognitoClient();

  private playerMapper = new PlayerMapper();
  private seasonMapper = new SeasonMapper();

  buildResponse(result: AttributeMap): PlayerResponse {
    const node = this.playerMapper.toNode(result);
    const view = this.playerMapper.toView(node);

    return { ...view };
  }

  async buildRoleResponse(result: AttributeMap): Promise<PlayerRoleResponse> {
    const node = this.playerMapper.toRoleNode(result);
    const view = this.playerMapper.toRoleView(node);

    const user = await this.cognitoClient.adminGetUser(node.userName);
    const userRole = user.UserAttributes.find((attr) => attr.Name === "custom:role");

    if (!userRole) {
      throw new Error(`Could not fetch role from cognito for user: ${node.userName}.`);
    }

    return {
      ...view,
      role: userRole.Value as string
    };
  }

  async create(data: PlayerCreateRequest): Promise<PlayerResponse> {
    const item = this.playerMapper.toCreateItem(data);

    if (item.epithet === "[[random]]") {
      item.epithet = Sentencer.make("{{ adjective }} {{ noun }}");
    }

    const result = await this.playerClient.create({ playerId: item.playerId }, item);

    await this.cognitoClient.adminUpdateUserAttribute(data.userName, [
      {
        Name: "custom:firstTimeLogin",
        Value: "0"
      }
    ]);

    return this.buildResponse(result);
  }

  async query(queryParams: PlayerQueryParameters): Promise<PlayerResponse[]> {
    const playerFilters = this.playerMapper.toFilters(queryParams);

    let players = await this.playerClient.query(playerFilters);

    if (queryParams.season) {
      const seasonFilters = this.seasonMapper.toFilters({ season: queryParams.season });

      const seasons = await this.seasonClient.query(seasonFilters);

      const seasonPlayerIds = seasons[0] ? (seasons[0].playerIds as string[]) : [];

      players = players.filter((player) =>
        seasonPlayerIds.find((playerId) => playerId === player.playerId)
      );
    }

    return players.map(this.buildResponse);
  }

  async get(playerId: string): Promise<PlayerResponse> {
    const result = await this.playerClient.fetchByKey({ playerId });

    return this.buildResponse(result);
  }

  async getRoles(): Promise<PlayerRoleResponse[]> {
    const players = await this.playerClient.query();

    if (!players.length) {
      return [];
    }

    return Promise.all(players.map(this.buildRoleResponse));
  }

  async remove(playerId: string): Promise<SuccessResponse> {
    await this.playerClient.remove({ playerId });

    return { message: "Successfully deleted player." };
  }

  async update(playerId: string, data: PlayerUpdateRequest): Promise<PlayerResponse> {
    const item = this.playerMapper.toUpdateItem(data);

    const result = await this.playerClient.update({ playerId }, item);

    return this.buildResponse(result);
  }

  async updateRole(playerId: string, data: PlayerUpdateRoleRequest): Promise<PlayerRoleResponse> {
    const result = await this.playerClient.fetchByKey({ playerId });

    await this.cognitoClient.adminUpdateUserAttribute(result.userName as string, [
      {
        Name: "custom:role",
        Value: data.role
      }
    ]);

    return await this.buildRoleResponse(result);
  }
}
