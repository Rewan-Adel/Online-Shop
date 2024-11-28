import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import server from '../server';
import User from '../models/user.model';
import EncryptionService from '../utils/EncryptionService';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const dbURI = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbURI);
  }
  console.log('In-memory DB connected');
});

beforeEach(async () => {
  await User.create({
    username: 'test',
    email: 'rewanmahrous0@gmail.com',
    password: await new EncryptionService().hash('12345678'),
  });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Auth', () => {
  it('should send email and create user obj', async () => {
    const response = await request(server)
      .post('/api/auth/signup')
      .send({
        username: 'test',
        email: 'rewanmahrous0@gmail.com',
        password: '12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('Verification code sent.');
    expect(response.body.data).toHaveProperty('user');
  });
  
  it("should verify user email", async () => {
    const response = await request(server).post("/api/auth/verify-email").send({
      email: 'rewanmahrous0@gmail.com',
      code: "12345678",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email verified successfully");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");
  });

  it("should login user", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({
        email: 'rewanmahrous0@gmail.com',
        password:'12345678'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successfully");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");
  })
  
  it("should send reset password email", async () => {
    const response = await request(server)
      .post("/api/auth/forgot-password")
      .send({
        email:  'rewanmahrous0@gmail.com',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Reset password email sent.");
    expect(response.body.data).toHaveProperty("resetUrl");
  });
  it("should return 400 if email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/forgot-password")
      .send({
        email: 'invalidemail@example.com',
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email"); 
    expect(response.body.data).toBeNull(); 
  });

  it("should reset user password", async () => {
    const response = await request(server)
      .post("/api/auth/reset-password")
      .send({
        token: "",
        userID: "",
        password: 'test1234'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password reset successfully");
    expect(response.body.data).toHaveProperty("token");
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the DB connection
  await mongoServer.stop(); // Stop the in-memory DB server
  console.log('In-memory DB disconnected');
});