# Collection-management-system

Project Overview

The Collection Management System is a web application that allows users to manage customer data efficiently. The system supports adding, editing, deleting, and bulk uploading customer details while tracking their payment statuses. Real-time notifications and WebSocket integration ensure instant updates on payment status changes.

Features

• Add, edit, and delete customers  
• Bulk upload customers via Excel  
• Track payment status  
• Real-time notifications using WebSockets  
• Beautiful UI with Ant Design components  
• REST API with Express.js and MongoDB  
• Docker support for containerized deployment  

Setup Instructions
Prerequisites
Ensure you have the following installed:

• Node.js (v16 or later)  
• MongoDB (local or cloud)  
• Docker (optional for containerization)  

Installation Steps

Clone the repository:   
• git clone URL  
• cd customer-management-system  

Install dependencies for the frontend and backend:  

• npm install    
• install necessary packages  

Configure environment variables:  

• Copy .env.example to .env in the backend directory.    
• Fill in necessary values (e.g., MongoDB URI, port numbers).  

Start the backend server:

• cd backend  
• node index.js

Start the frontend server:  

• npm start  

Open the application in your browser:  

• http://localhost:3000  

Architecture Diagram  

![image](https://github.com/user-attachments/assets/950a7287-034d-4838-8fde-e26923efb3a6)


Technical Decisions Explanation  

• React with Ant Design for an elegant and modern UI.  
• Redux for state management.  
• Express & MongoDB for a scalable backend.  
• WebSockets for real-time updates.  
• Docker for easy deployment.  

Build the Docker images:  
• docker-compose build

Start the containers:  
• docker-compose up

Stop the containers:  
• docker-compose down

Environment Variables  

Create a .env file based on .env.example and set the following:  
• PORT=5000  
• MONGO_URI= "mongodb://127.0.0.1:27017/collectionDB"  
• JWT_SECRET= 'hello@123'  

Future Improvements  

• Implement authentication & role-based access control.  
• Improve UI responsiveness.  
• Optimize bulk upload processing.  
• Enhance error handling and logging.  
