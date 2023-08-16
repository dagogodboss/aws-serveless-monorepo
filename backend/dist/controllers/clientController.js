"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const clientService_1 = __importDefault(require("../services/clientService"));
class ClientController {
    constructor(docClient, tableName) {
        this.clientService = new clientService_1.default(docClient, tableName);
    }
    async createClient(event, context) {
        try {
            const clientData = JSON.parse(event.body || "{}");
            const client = await this.clientService.createClient(clientData);
            return {
                statusCode: 201,
                body: JSON.stringify(client),
            };
        }
        catch (error) {
            console.error("Error creating client:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async getClient(event, context) {
        var _a;
        try {
            const clientId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.clientId;
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
        }
        catch (error) {
            console.error("Error fetching client:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async listClients(event, context) {
        try {
            const clients = await this.clientService.listClients();
            return {
                statusCode: 200,
                body: JSON.stringify(clients),
            };
        }
        catch (error) {
            console.error("Error fetching clients:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async createClientsFromExcel(event, context) {
        try {
            const file = (event === null || event === void 0 ? void 0 : event.body) || null;
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
        }
        catch (error) {
            console.error("Error creating clients from Excel:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
}
exports.ClientController = ClientController;
