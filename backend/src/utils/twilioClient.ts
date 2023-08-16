/** @format */

import Twilio from "twilio";
import { TwilioConfig } from "../config"; 

class TwilioClient {
  private client: Twilio.Twilio;

  constructor() {
    // Initialize Twilio client with your Twilio account SID and auth token
    this.client = Twilio(TwilioConfig.accountSid, TwilioConfig.authToken);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        to,
        from: TwilioConfig.senderPhoneNumber, // Replace with your Twilio phone number
        body: message,
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw new Error("Failed to send SMS");
    }
  }
}

export default new TwilioClient();
