interface Notification {
  notificationId: string;
  jobId: string;
  message: string;
  receivers: string[]; // Array of employeeIds who will receive the notification
  notificationChannel: "email" | "sms"; // Default value: "email"
  createdAt: string;
}

export default Notification;
