import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Job from "../models/Job";
import { EventEmitter } from "events";

class JobService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string,
    private readonly emitter: EventEmitter,
  ) {}

  async createJob(job: Job): Promise<Job> {
    const params = {
      TableName: this.tableName,
      Item: job,
    };

    await this.docClient.put(params).promise();
    this.emitter.emit("createNotification", job);
    return job;
  }

  async updateJob(job: Job): Promise<Job> {
    const params = {
      TableName: this.tableName,
      Key: { jobId: job.jobId },
      UpdateExpression:
        "SET #name = :name, #clientName = :clientName, #jobLocation = :jobLocation, #price = :price, #description = :description, #assignee = :assignee, #status = :status",
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
    return result.Attributes as Job;
  }

  async deleteJob(jobId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { jobId },
    };

    await this.docClient.delete(params).promise();
  }

  async getJob(jobId: string): Promise<Job | null> {
    const params = {
      TableName: this.tableName,
      Key: { jobId },
    };

    const result = await this.docClient.get(params).promise();
    return result.Item as Job | null;
  }

  async listJobs(): Promise<Job[]> {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.docClient.scan(params).promise();
    return result.Items as Job[];
  }
}

export default JobService;
