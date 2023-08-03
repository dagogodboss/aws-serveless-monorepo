# HOC JOB BOARD

Project Name is a job board application for a drilling company that allows job managers to create jobs with dynamic fields like job description, name, client name, job location, price, etc. The application is built using AWS Serverless with Express TypeScript, DynamoDB, and ReactJS for the frontend. It also includes a notification system that allows employees to receive notices via email, on the app, and on their phone through the Twilio API when new jobs are added.

## Features

- Job Manager can create jobs with dynamic fields like job description, name, client name, job location, price, etc.
- Employee Management page to add employees from an Excel sheet or another external API.
- Client Management page to add clients.
- Real-time job board display that updates whenever a manager adds a new job to the Database.
- Authentication using JWT to protect job-related endpoints.
- Notification system to send email and SMS notifications to employees for new job assignments.
- CRUD operations for jobs (Create, Read, Update, Delete).
- Bulk creation of employees and clients using an Excel spreadsheet.

## Tech Stack

- Frontend: ReactJS
- Backend: AWS Lambda (Serverless) with Express TypeScript
- Database: Amazon DynamoDB
- Authentication: JSON Web Tokens (JWT)
- External API: Twilio API for sending SMS notifications
- Twilio Node.js SDK for SMS messaging

## Installation

1. Clone the repository.
2. Install dependencies for the backend:

```bash
cd backend
npm install
```

3. Install dependencies for the frontend:

```bash
cd frontend
npm install
```

4. Set up the required environment variables for AWS, Twilio, and other configurations.

## Backend Folder Structure

The backend folder structure is organized as follows:

```
backend/
  |-- src/
  |    |-- controllers/
  |    |    |-- jobController.ts
  |    |    |-- employeeController.ts
  |    |    |-- clientController.ts
  |    |    |-- notificationController.ts
  |    |-- models/
  |    |    |-- Job.ts
  |    |    |-- Employee.ts
  |    |    |-- Client.ts
  |    |    |-- Notification.ts
  |    |-- routes/
  |    |    |-- jobRoutes.ts
  |    |    |-- employeeRoutes.ts
  |    |    |-- clientRoutes.ts
  |    |    |-- notificationRoutes.ts
  |    |-- services/
  |    |    |-- jobService.ts
  |    |    |-- employeeService.ts
  |    |    |-- clientService.ts
  |    |    |-- notificationService.ts
  |    |-- utils/
  |    |    |-- excelParser.ts
  |    |    |-- twilioClient.ts
  |    |-- index.ts (for defining Lambda functions and handlers)
  |    |-- eventEmitter.ts (for initializing the shared event emitter)
  |-- serverless.yml
  |-- package.json
  |-- tsconfig.json
```

## Frontend Folder Structure

The frontend folder structure is organized as follows:

```
frontend/
  |-- public/
  |-- src/
  |    |-- components/
  |    |-- pages/
  |    |-- App.js
  |    |-- index.js
  |-- package.json
```

## Deployment

1. Deploy the backend using the Serverless Framework:

```bash
cd backend
sls deploy
```

2. Deploy the frontend using your preferred hosting service (e.g., AWS Amplify, Netlify, Vercel, etc.).

## Usage

- Job Managers can create, update, and delete jobs via the frontend UI or API endpoints.
- Employees can receive email and SMS notifications for new job assignments.
- Use the Employee Management page to bulk add employees from an Excel spreadsheet.
- Use the Client Management page to add new clients.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgments

- [Twilio API](https://www.twilio.com/docs/quickstart/node/programmable-sms)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
- [Serverless Framework](https://www.serverless.com/)
- [ReactJS](https://reactjs.org/)

## Contributing

Contributions are welcome! If you find a bug or want to add new features, feel free to open an issue or submit a pull request.

---

Please note that this ReadMe template is just a starting point, and you should tailor it to your specific project, adding more detailed information and instructions as needed.
