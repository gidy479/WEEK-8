const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

// Connect to test database before running tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bankDB_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Clear database after each test
afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

// Close database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API Tests', () => {
    // Test valid Nigeria number
    it('should create user with valid Nigeria number', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                phoneNumber: "+2348123456789",
                accountNumber: "ACC123456"
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });

    // Test valid Ghana number
    it('should create user with valid Ghana number', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: "Kwame Mensah",
                phoneNumber: "+233123456789",
                accountNumber: "ACC789012"
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });

    // Test invalid phone number
    it('should reject invalid phone number', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: "Test User",
                phoneNumber: "+1234567890",
                accountNumber: "ACC345678"
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors[0].field).toBe('phoneNumber');
    });

    // Test missing name
    it('should reject missing name', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                phoneNumber: "+2348123456789",
                accountNumber: "ACC123456"
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors[0].field).toBe('name');
    });
}); 