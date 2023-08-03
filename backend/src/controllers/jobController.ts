import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import JobService from "../services/jobService";
import Job from "../models/Job";
import { verifyJwtToken } from "../utils/authUtils";
import { EventEmitter } from "events";

class JobController {
  private readonly jobService: JobService;

  constructor(
    docClient: DocumentClient,
    tableName: string,
    emitter: EventEmitter,
  ) {
    this.jobService = new JobService(docClient, tableName, emitter);
  }

  private verifyRole(event: APIGatewayProxyEvent, role: string): boolean {
    const jwtToken = event.headers.Authorization;
    if (!jwtToken) return false;

    const decodedToken = verifyJwtToken(jwtToken);
    if (!decodedToken || decodedToken.role !== role) return false;

    return true;
  }

  async createJob(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      if (!this.verifyRole(event, "jobManager")) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Access forbidden" }),
        };
      }

      const jobData = JSON.parse(event.body || "{}") as Job;
      // Set additional properties for the job (e.g., jobId, createdAt, etc.)
      const job: Job = {
        ...jobData,
        jobId: uuid(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      const createdJob = await this.jobService.createJob(job);
      return {
        statusCode: 201,
        body: JSON.stringify(createdJob),
      };
    } catch (error) {
      console.error("Error creating job:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async updateJob(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      if (!this.verifyRole(event, "jobManager")) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Access forbidden" }),
        };
      }

      const jobId = event.pathParameters?.jobId;
      if (!jobId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing jobId in the path" }),
        };
      }

      const existingJob = await this.jobService.getJob(jobId);
      if (!existingJob) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Job not found" }),
        };
      }

      const jobData = JSON.parse(event.body || "{}") as Job;
      const updatedJob: Job = {
        ...existingJob,
        ...jobData,
      };
      const result = await this.jobService.updateJob(updatedJob);
      if (!result) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Failed to update job" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      console.error("Error updating job:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async deleteJob(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      if (!this.verifyRole(event, "jobManager")) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Access forbidden" }),
        };
      }

      const jobId = event.pathParameters?.jobId;
      if (!jobId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing jobId in the path" }),
        };
      }

      await this.jobService.deleteJob(jobId);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Job deleted successfully" }),
      };
    } catch (error) {
      console.error("Error deleting job:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async getJob(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const jobId = event.pathParameters?.jobId;
      if (!jobId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing jobId in the path" }),
        };
      }

      const job = await this.jobService.getJob(jobId);
      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Job not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(job),
      };
    } catch (error) {
      console.error("Error fetching job:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async listJobs(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const jobs = await this.jobService.listJobs();
      return {
        statusCode: 200,
        body: JSON.stringify(jobs),
      };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }
}

export { JobController };
