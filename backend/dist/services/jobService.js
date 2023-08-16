"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobService {
    constructor(docClient, tableName, emitter) {
        this.docClient = docClient;
        this.tableName = tableName;
        this.emitter = emitter;
    }
    async createJob(job) {
        const params = {
            TableName: this.tableName,
            Item: job,
        };
        await this.docClient.put(params).promise();
        this.emitter.emit("createNotification", job);
        return job;
    }
    async updateJob(job) {
        const params = {
            TableName: this.tableName,
            Key: { jobId: job.jobId },
            UpdateExpression: "SET #name = :name, #clientName = :clientName, #jobLocation = :jobLocation, #price = :price, #description = :description, #assignee = :assignee, #status = :status",
            ExpressionAttributeNames: {
                "#name": "name",
                "#clientName": "clientName",
                "#jobLocation": "jobLocation",
                "#price": "price",
                "#description": "description",
                "#assignee": "assignee",
                "#status": "status",
            },
            ExpressionAttributeValues: {
                ":name": job.name,
                ":clientName": job.clientName,
                ":jobLocation": job.jobLocation,
                ":price": job.price,
                ":description": job.description,
                ":assignee": job.assignee,
                ":status": job.status,
            },
            ReturnValues: "ALL_NEW",
        };
        const result = await this.docClient.update(params).promise();
        return result.Attributes;
    }
    async deleteJob(jobId) {
        const params = {
            TableName: this.tableName,
            Key: { jobId },
        };
        await this.docClient.delete(params).promise();
    }
    async getJob(jobId) {
        const params = {
            TableName: this.tableName,
            Key: { jobId },
        };
        const result = await this.docClient.get(params).promise();
        return result.Item;
    }
    async listJobs() {
        const params = {
            TableName: this.tableName,
        };
        const result = await this.docClient.scan(params).promise();
        return result.Items;
    }
}
exports.default = JobService;
