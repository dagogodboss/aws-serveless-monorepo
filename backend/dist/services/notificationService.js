"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilioClient_1 = __importDefault(require("../utils/twilioClient"));
class NotificationService {
    constructor(docClient, tableName, emitter) {
        this.docClient = docClient;
        this.tableName = tableName;
        this.emitter = emitter;
        // Listen for the "createNotification" event and handle it
        this.emitter.on("createNotification", async (notification) => {
            await this.createNotification(notification);
        });
        // Listen for the "sendNotification" event and handle it
        this.emitter.on("sendNotification", async (notification) => {
            await this.sendNotifications(notification);
        });
    }
    async createNotification(notification) {
        const params = {
            TableName: this.tableName,
            Item: notification,
        };
        await this.docClient.put(params).promise();
        // Send notification asynchronously using event emitter
        this.emitter.emit("sendNotification", notification);
        return notification;
    }
    async viewNotifications(jobId) {
        const params = {
            TableName: this.tableName,
            FilterExpression: "#jobId = :jobId",
            ExpressionAttributeNames: {
                "#jobId": "jobId",
            },
            ExpressionAttributeValues: {
                ":jobId": jobId,
            },
        };
        const result = await this.docClient.scan(params).promise();
        return result.Items;
    }
    async sendNotifications(notification) {
        const { receivers, notificationChannel, message } = notification;
        for (const receiverId of receivers) {
            try {
                if (notificationChannel === "email") {
                    // Code to send email notification (implement your email sending logic)
                    console.log(`Sending email to employee with ID: ${receiverId}`);
                }
                else if (notificationChannel === "sms") {
                    // Code to send SMS notification using Twilio
                    await twilioClient_1.default.sendMessage(receiverId, message);
                    console.log(`Sending SMS to employee with ID: ${receiverId}`);
                }
            }
            catch (error) {
                console.error("Error sending notification:", error);
            }
        }
    }
}
exports.default = NotificationService;
