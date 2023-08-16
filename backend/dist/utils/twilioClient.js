"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../config");
class TwilioClient {
    constructor() {
        // Initialize Twilio client with your Twilio account SID and auth token
        this.client = (0, twilio_1.default)(config_1.TwilioConfig.accountSid, config_1.TwilioConfig.authToken);
    }
    async sendMessage(to, message) {
        try {
            await this.client.messages.create({
                to,
                from: config_1.TwilioConfig.senderPhoneNumber,
                body: message,
            });
        }
        catch (error) {
            console.error("Error sending SMS:", error);
            throw new Error("Failed to send SMS");
        }
    }
}
exports.default = new TwilioClient();
