"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const excelParser_1 = require("../utils/excelParser");
class ClientService {
    constructor(docClient, tableName) {
        this.docClient = docClient;
        this.tableName = tableName;
    }
    async createClient(client) {
        const params = {
            TableName: this.tableName,
            Item: client,
        };
        await this.docClient.put(params).promise();
        return client;
    }
    async getClient(clientId) {
        const params = {
            TableName: this.tableName,
            Key: { clientId },
        };
        const result = await this.docClient.get(params).promise();
        return result.Item;
    }
    async listClients() {
        const params = {
            TableName: this.tableName,
        };
        const result = await this.docClient.scan(params).promise();
        return result.Items;
    }
    async createClientsFromExcel(file) {
        try {
            const clients = [];
            // Assuming readExcelFile is a function that parses the Excel file and returns the data as an array
            const data = (0, excelParser_1.readExcelFile)(file);
            // Process the data and create clients
            for (const row of data) {
                const client = {
                    clientId: row.clientId,
                    name: row.name,
                    email: row.email,
                    createdAt: new Date().toISOString(),
                };
                await this.createClient(client);
                clients.push(client);
            }
            return clients;
        }
        catch (error) {
            console.error("Error creating clients from Excel:", error);
            throw new Error("Failed to create clients from Excel");
        }
    }
}
exports.default = ClientService;
