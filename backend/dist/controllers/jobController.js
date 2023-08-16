"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const uuid_1 = require("uuid");
const jobService_1 = __importDefault(require("../services/jobService"));
const authUtils_1 = require("../utils/authUtils");
class JobController {
    constructor(docClient, tableName, emitter) {
        this.jobService = new jobService_1.default(docClient, tableName, emitter);
    }
    verifyRole(event, role) {
        const jwtToken = event.headers.Authorization;
        if (!jwtToken)
            return false;
        const decodedToken = (0, authUtils_1.verifyJwtToken)(jwtToken);
        if (!decodedToken || decodedToken.role !== role)
            return false;
        return true;
    }
    async createJob(event, context) {
        try {
            if (!this.verifyRole(event, "jobManager")) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: "Access forbidden" }),
                };
            }
            const jobData = JSON.parse(event.body || "{}");
            // Set additional properties for the job (e.g., jobId, createdAt, etc.)
            const job = {
                ...jobData,
                jobId: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString(),
                status: "pending",
            };
            const createdJob = await this.jobService.createJob(job);
            return {
                statusCode: 201,
                body: JSON.stringify(createdJob),
            };
        }
        catch (error) {
            console.error("Error creating job:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async updateJob(event, context) {
        var _a;
        try {
            if (!this.verifyRole(event, "jobManager")) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: "Access forbidden" }),
                };
            }
            const jobId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.jobId;
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
            const jobData = JSON.parse(event.body || "{}");
            const updatedJob = {
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
        }
        catch (error) {
            console.error("Error updating job:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async deleteJob(event, context) {
        var _a;
        try {
            if (!this.verifyRole(event, "jobManager")) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: "Access forbidden" }),
                };
            }
            const jobId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.jobId;
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
        }
        catch (error) {
            console.error("Error deleting job:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async getJob(event, context) {
        var _a;
        try {
            const jobId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.jobId;
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
        }
        catch (error) {
            console.error("Error fetching job:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async listJobs(event, context) {
        try {
            const jobs = await this.jobService.listJobs();
            return {
                statusCode: 200,
                body: JSON.stringify(jobs),
            };
        }
        catch (error) {
            console.error("Error fetching jobs:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
}
exports.JobController = JobController;
