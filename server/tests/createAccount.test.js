import { describe, it, expect, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import createAccount from '../src/user/createAccount.js';
import { supabase } from '../src/supabase.js';

const app = express();
app.use(express.json());
app.use('/api', createAccount); 

describe('POST /api/create-account', () => {
  it('should create a new account and return 201', async () => {

    const newUser = {
      username: 'newUser',
      password: 'newPassword'
    };

    const response = await supertest(app)
      .post('/api/create-account')
      .send(newUser);

    // test if account successfully created
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Account created successfully');

    // Check for the jwt cookie
    const cookieHeader = response.headers['set-cookie'][0];
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toMatch(/jwt=.+/);
    expect(cookieHeader).toContain('HttpOnly');
  });

  it('should return 409 if username is already taken', async () => {
    
    const existingUser = {
      username: 'testUser',
      password: 'password'
    };

    const response = await supertest(app)
      .post('/api/create-account')
      .send(existingUser);

    // test if user already exists
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Username is already taken');
  });
  // delete test user model
  afterAll(async() => {
    await supabase.from('users').delete().match({ username: 'newUser' });
  });
});


