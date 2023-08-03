
interface Employee {
  employeeId: string;
  name: string;
  email: string;
  role: "jobManager" | "employee";
  department: string;
  createdAt: string;
}

export default Employee;
