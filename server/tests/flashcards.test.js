import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import login from '../src/user/login.js';
import flashcards from '../src/api/getSet.js';
import { supabase } from '../src/supabase.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use('/user', login);
app.use('/api', flashcards);

// POST HTTP Request
describe('POST /api/flashcard-sets', () => {
    let setID;
    let jwt;

    beforeAll(async () => {
        // login to get jwt token
        const loginResponse = await supertest(app)
            .post('/user/login')
            .send({
                username: 'testUser',
                password: 'password',
                remember: true
            });

        const jwtCookie = loginResponse.headers['set-cookie'][0];
        jwt = jwtCookie.split(';')[0]; 
    });

    afterAll(async () => {
        if (setID) {
            // Delete the created flashcard set from the database after each test
            await supabase 
                .from('flashcards')
                .delete()
                .match({ parent: setID })
            await supabase // delete flashcard set
                .from('flashcard_sets')
                .delete()
                .match({ id: setID });
        }
    });

    it('should create a new flashcard set and return 201 with the user ID 44', async () => {
        const newFlashcardSet = {
            title: 'Test Set',
            description: 'Test Description',
            flashcards: [
                { front: 'Front 1', back: 'Back 1', description: 'sup' },
                { front: 'Front 2', back: 'Back 2', description: 'sup' }
            ],
            is_private: false
        };
  
        const response = await supertest(app)
            .post('/api/flashcard-sets')
            .set('Cookie', jwt) 
            .send(newFlashcardSet);
        
        setID = response.body.flashcardSet[0].id;
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Flashcard set created successfully');
        expect(response.body.flashcardSet).toBeDefined();
        
    });
});

// GET HTTP Request
describe('GET /api/flashcard-sets', () => {
    let setID, privateID;
    let jwt;

    beforeAll(async() => {
        const loginResponse = await supertest(app)
            .post('/user/login')
            .send({
                username: 'testUser',
                password: 'password',
                remember: true
            });

        const jwtCookie = loginResponse.headers['set-cookie'][0];
        jwt = jwtCookie.split(';')[0]; 

        // create new flashcard set
        const publicSet = {
            title: 'Test Set',
            description: 'Test Description',
            flashcards: [
                { front: 'Front 1', back: 'Back 1', description: 'sup' },
                { front: 'Front 2', back: 'Back 2', description: 'sup' }
            ],
            is_private: false
        };

        const privateSet = {
            title: 'Private Test Set',
            description: 'Private Test Description',
            flashcards: [
                { front: 'Private Front 1', back: 'Private Back 1', description: 'hello' },
                { front: 'Private Front 2', back: 'Private Back 2', description: 'hello' }
            ],
            is_private: true
        };

        const response = await supertest(app)
            .post('/api/flashcard-sets')
            .set('Cookie', jwt)
            .send(publicSet);
        
        setID = response.body.flashcardSet[0].id;

        const privateResponse = await supertest(app)
            .post('/api/flashcard-sets')
            .set('Cookie', jwt)
            .send(privateSet);

        privateID = privateResponse.body.flashcardSet[0].id;
    });

    afterAll(async () => {
        if (setID) {
            // delete the created flashcard after each test
            await supabase
                .from('flashcards')
                .delete()
                .match({ parent: setID })
            await supabase 
                .from('flashcard_sets')
                .delete()
                .match({ id: setID });
        }
        if (privateID) {
            await supabase
                .from('flashcards')
                .delete()
                .match({ parent: privateID })
            await supabase 
                .from('flashcard_sets')
                .delete()
                .match({ id: privateID });
        }
    });

    it('should retrieve a public flashcard set with flashcards', async () => {
        const response = await supertest(app)
            .get(`/api/flashcard-sets/${setID}`)
            .set('Cookie', jwt);

        expect(response.status).toBe(200);
        expect(response.body.flashcardSet).toBeDefined();
        expect(response.body.flashcardSet.is_private).toBe(false);
        expect(response.body.flashcardSet.flashcards).toBeDefined();
        expect(Array.isArray(response.body.flashcardSet.flashcards)).toBe(true);
    });

    it('should successfully retrieve a users own private flashcard set', async () => {
        const response = await supertest(app)
            .get(`/api/flashcard-sets/${privateID}`)
            .set('Cookie', jwt);
        
        //console.log(response)
        expect(response.status).toBe(200);
        expect(response.body.flashcardSet).toBeDefined();
        expect(response.body.flashcardSet.is_private).toBe(true);
        expect(response.body.flashcardSet.flashcards).toBeDefined();
        expect(Array.isArray(response.body.flashcardSet.flashcards)).toBe(true);
    });

    it('should unsuccessfully retrieve a foreign private flashcard set', async () => {
        // set up unauthorized user
        const loginResponse = await supertest(app)
            .post('/user/login')
            .send({
                username: 'invalidUser',
                password: 'password',
                remember: true
            });

        const jwtCookie = loginResponse.headers['set-cookie'][0];
        jwt = jwtCookie.split(';')[0]; 

        const response = await supertest(app)
            .get(`/api/flashcard-sets/${privateID}`)
            .set('Cookie', jwt);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You do not have access to this page!');
    });
});