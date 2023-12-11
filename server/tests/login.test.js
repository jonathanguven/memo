import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import login from '../src/user/login.js';

const app = express();
app.use(express.json());
app.use('/api', login);

describe('POST /api/login', () => {
    it('should return 200 and login success message for valid credentials', async () => {
        const response = await supertest(app)
        .post('/api/login')
        .send({
            username: 'testUser',
            password: 'password',
            remember: true
        });

        // test for existing users
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful!');
        expect(response.body.username).toBe('testUser');

        // testing for jwt
        const jwtCookie = response.headers['set-cookie'][0];
        expect(jwtCookie).toBeDefined();
        expect(jwtCookie).toMatch(/jwt=.+/);
        expect(jwtCookie).toContain('HttpOnly');
    });

    it('should return 401 for invalid credentials', async () => {
        const response = await supertest(app)
        .post('/api/login')
        .send({
            username: 'invalidUser',
            password: 'invalidPassword',
            remember: false
        });

        // testing for credentials that do not exist
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid username or password');
    });
});
