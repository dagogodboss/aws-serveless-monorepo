
interface Job {
  jobId: string;
  name: string;
  description: string;
  clientName: string;
  jobLocation: string;
  price: number;
  status: "pending" | "completed" | "cancelled";
  assignee: string[]; // Array of employeeIds assigned to the job
  createdAt: string;
}

export default Job;
