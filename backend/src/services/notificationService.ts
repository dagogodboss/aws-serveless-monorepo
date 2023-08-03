import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Notification from "../models/Notification";
import { EventEmitter } from "events";
import twilioClient from "../utils/twilioClient";

class NotificationService {
  private readonly docClient: DocumentClient;
  private readonly tableName: string;
  private readonly emitter: EventEmitter;

  constructor(
    docClient: DocumentClient,
    tableName: string,
    emitter: EventEmitter,
  ) {
    this.docClient = docClient;
    this.tableName = tableName;
    this.emitter = emitter;

    // Listen for the "createNotification" event and handle it
    this.emitter.on(
      "createNotification",
      async (notification: Notification) => {
        await this.createNotification(notification);
      },
    );

    // Listen for the "sendNotification" event and handle it
    this.emitter.on("sendNotification", async (notification: Notification) => {
      await this.sendNotifications(notification);
    });
  }

  async createNotification(notification: Notification): Promise<Notification> {
    const params = {
      TableName: this.tableName,
      Item: notification,
    };

    await this.docClient.put(params).promise();

    // Send notification asynchronously using event emitter
    this.emitter.emit("sendNotification", notification);

    return notification;
  }

  async viewNotifications(jobId: string): Promise<Notification[]> {
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
    return result.Items as Notification[];
  }

  async sendNotifications(notification: Notification): Promise<void> {
    const { receivers, notificationChannel, message } = notification;

    for (const receiverId of receivers) {
      try {
        if (notificationChannel === "email") {
          // Code to send email notification (implement your email sending logic)
          console.log(`Sending email to employee with ID: ${receiverId}`);
        } else if (notificationChannel === "sms") {
          // Code to send SMS notification using Twilio
          await twilioClient.sendMessage(receiverId, message);
          console.log(`Sending SMS to employee with ID: ${receiverId}`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  }
}

export default NotificationService;
