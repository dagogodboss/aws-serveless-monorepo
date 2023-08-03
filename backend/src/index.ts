/** @format */

import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AWS from "aws-sdk";
import { JobController } from "./controllers/jobController";
import { EmployeeController } from "./controllers/employeeController";
import { ClientController } from "./controllers/clientController";
import { NotificationController } from "./controllers/notificationController";
import emitter from "./eventEmitter";

// AWS SDK configurations if needed
AWS.config.update({
  region: "your-aws-region",
  // add other configurations as needed
});

const docClient = new DocumentClient();
const tableNameJobs = process.env.DYNAMODB_TABLE_JOBS as string;
const tableNameEmployees = process.env.DYNAMODB_TABLE_EMPLOYEES as string;
const tableNameClients = process.env.DYNAMODB_TABLE_CLIENTS as string;
const tableNameNotifications = process.env
  .DYNAMODB_TABLE_NOTIFICATIONS as string;

// Create instances of controllers with the shared event emitter
const jobController = new JobController(docClient, tableNameJobs, emitter);
const employeeController = new EmployeeController(
  docClient,
  tableNameEmployees,
  emitter,
);
const clientController = new ClientController(docClient, tableNameClients);
const notificationController = new NotificationController(
  docClient,
  tableNameNotifications,
  emitter,
);

// Define Lambda functions and their handlers here
export const createJob: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return jobController.createJob(event, context);
};

export const updateJob: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return jobController.updateJob(event, context);
};

export const deleteJob: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return jobController.deleteJob(event, context);
};

export const getJob: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return jobController.getJob(event, context);
};

export const listJobs: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return jobController.listJobs(event, context);
};

// Define other Lambda functions and their handlers for other routes...
