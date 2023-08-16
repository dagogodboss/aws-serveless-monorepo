"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobs = exports.getJob = exports.deleteJob = exports.updateJob = exports.createJob = exports.login = exports.register = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const jobController_1 = require("./controllers/jobController");
const employeeController_1 = require("./controllers/employeeController");
// import { ClientController } from "./controllers/clientController";
// import { NotificationController } from "./controllers/notificationController";
const authController_1 = require("./controllers/authController");
const eventEmitter_1 = __importDefault(require("./eventEmitter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// AWS SDK configurations if needed
aws_sdk_1.default.config.update({
    region: "your-aws-region",
    // add other configurations as needed
});
const docClient = new dynamodb_1.DocumentClient();
const tableNameJobs = process.env.DYNAMODB_TABLE_JOBS;
const tableNameEmployees = process.env.DYNAMODB_TABLE_EMPLOYEES;
const tableNameClients = process.env.DYNAMODB_TABLE_CLIENTS;
const tableNameNotifications = process.env
    .DYNAMODB_TABLE_NOTIFICATIONS;
// Create instances of controllers with the shared event emitter
const authController = new authController_1.AuthController();
const jobController = new jobController_1.JobController(docClient, tableNameJobs, eventEmitter_1.default);
const employeeController = new employeeController_1.EmployeeController(docClient, tableNameEmployees, eventEmitter_1.default);
// const clientController = new ClientController(docClient, tableNameClients);
// Define Lambda functions and their handlers here
const register = async (event, context) => {
    return authController.register(event, context); // Route to the register method in AuthController
};
exports.register = register;
const login = async (event, context) => {
    return authController.login(event, context); // Route to the login method in AuthController
};
exports.login = login;
const createJob = async (event, context) => {
    return jobController.createJob(event, context);
};
exports.createJob = createJob;
const updateJob = async (event, context) => {
    return jobController.updateJob(event, context);
};
exports.updateJob = updateJob;
const deleteJob = async (event, context) => {
    return jobController.deleteJob(event, context);
};
exports.deleteJob = deleteJob;
const getJob = async (event, context) => {
    return jobController.getJob(event, context);
};
exports.getJob = getJob;
const listJobs = async (event, context) => {
    return jobController.listJobs(event, context);
};
exports.listJobs = listJobs;
// Define other Lambda functions and their handlers for other routes...
