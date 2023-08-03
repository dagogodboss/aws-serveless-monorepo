import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import ClientService from "../services/clientService";
import Client from "../models/Client";
import { EventEmitter } from 'events';

class ClientController {
  private readonly clientService: ClientService;

  constructor(
    docClient: DocumentClient,
    tableName: string
  ) {
    this.clientService = new ClientService(docClient, tableName);
  }

  async createClient(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const clientData = JSON.parse(event.body || "{}") as Client;
      const client = await this.clientService.createClient(clientData);
      return {
        statusCode: 201,
        body: JSON.stringify(client),
      };
    } catch (error) {
      console.error("Error creating client:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async getClient(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const clientId = event.pathParameters?.clientId;
      if (!clientId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing clientId in the path" }),
        };
      }

      const client = await this.clientService.getClient(clientId);
      if (!client) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Client not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(client),
      };
    } catch (error) {
      console.error("Error fetching client:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async listClients(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const clients = await this.clientService.listClients();
      return {
        statusCode: 200,
        body: JSON.stringify(clients),
      };
    } catch (error) {
      console.error("Error fetching clients:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async createClientsFromExcel(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const file = event?.body || null;
      if (!file) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Missing Excel file in the request",
          }),
        };
      }

      const clients = await this.clientService.createClientsFromExcel(file);
      return {
        statusCode: 201,
        body: JSON.stringify(clients),
      };
    } catch (error) {
      console.error("Error creating clients from Excel:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }
}

export { ClientController };
