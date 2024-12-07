### Online Shop Server
This is the backend server for an Online Shop application. It is built using Node.js and follows a Layered Architecture to ensure scalability and maintainability.

## Features
- User authentication (JWT-based)
- Product management (CRUD operations)
- Order management
- Cart functionality
- Payment processing
- Admin functionalities
- 
## Tech Stack
- Node.js: TypeScript runtime environment
- Express.js: Web framework for Node.js
- MongoDB: Database for storing user, product, and order data
- JWT: JSON Web Token for user authentication
- bcrypt: Password hashing and comparison
- Mongoose: MongoDB object modeling tool
  
### Architecture
The server follows a Layered Architecture that helps organize code into distinct layers with specific responsibilities. The main layers include:

- Controllers: Handle HTTP requests, interact with the service layer, and send responses back to the client.
- Services: Business logic layer, responsible for implementing the core functionalities like user authentication, order processing, etc.
- Repositories: Data access layer, responsible for interacting with the database.
- Models: Mongoose models for MongoDB schema definition.
- Utils: Utility functions (e.g., token generation, password hashing).
- Middleware: Functions that process requests before they reach the controllers (e.g., authentication middleware).

## Installation
1. Clone the repository:
```
 git clone https://github.com/Rewan-Adel/Online-Shop-.git
```
2.Navigate to the project directory:
```
cd Online-Shop-
```
3.Install dependencies:
```
npm install
```
4.Set up environment variables:
```
NODE_ENV = Env
PORT = port
DB_URI = mongodb://your-database-url
JWT_SECRET = your-jwt-secret-key
EMAIL_FORM_URL= your-email-form-url
```
5.Run the server:
```
npm run dev 
or
npm start
```
### ERD Model
![db](./images/Online%20Shop%20(1).png)


