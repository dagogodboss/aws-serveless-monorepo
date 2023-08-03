
import express from "express";
import { JobController } from "../controllers/jobController";

const router = express.Router();

const jobController = new JobController();

router.post("/", jobController.createJob);
router.put("/:jobId", jobController.updateJob);
router.delete("/:jobId", jobController.deleteJob);
router.get("/:jobId", jobController.getJob);
router.get("/", jobController.listJobs);

export default router;
