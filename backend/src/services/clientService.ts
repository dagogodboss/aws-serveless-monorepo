/** @format */

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Client from "../models/Client";
import { readExcelFile } from "../utils/excelParser";

class ClientService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string,
  ) {}

  async createClient(client: Client): Promise<Client> {
    const params = {
      TableName: this.tableName,
      Item: client,
    };

    await this.docClient.put(params).promise();
    return client;
  }

  async getClient(clientId: string): Promise<Client | null> {
    const params = {
      TableName: this.tableName,
      Key: { clientId },
    };

    const result = await this.docClient.get(params).promise();
    return result.Item as Client | null;
  }

  async listClients(): Promise<Client[]> {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.docClient.scan(params).promise();
    return result.Items as Client[];
  }

  async createClientsFromExcel(file: any): Promise<Client[]> {
    try {
      const clients: Client[] = [];

      // Assuming readExcelFile is a function that parses the Excel file and returns the data as an array
      const data = readExcelFile(file);

      // Process the data and create clients
      for (const row of data) {
        const client: Client = {
          clientId: row.clientId, // Assuming clientId is present in the Excel data
          name: row.name, // Assuming name is present in the Excel data
          email: row.email, // Assuming email is present in the Excel data
          createdAt: new Date().toISOString(),
        };

        await this.createClient(client);
        clients.push(client);
      }

      return clients;
    } catch (error) {
      console.error("Error creating clients from Excel:", error);
      throw new Error("Failed to create clients from Excel");
    }
  }
}

export default ClientService;
