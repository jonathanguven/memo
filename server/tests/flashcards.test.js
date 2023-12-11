import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import login from '../src/user/login.js';
import flashcards from '../src/api/flashcards.js';
import { supabase } from '../src/supabase.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use('/api', login);

app.use('/api/flashcard-sets', flashcards);

describe('POST /api/flashcard-sets', () => {
    let setID;
    let jwt;

    beforeEach(async () => {
        // login to get jwt token
        const loginResponse = await supertest(app)
            .post('/api/login')
            .send({
                username: 'testUser',
                password: 'password',
                remember: true
            });

        const jwtCookie = loginResponse.headers['set-cookie'][0];
        jwt = jwtCookie.split(';')[0]; 
    });
    it('should create a new flashcard set and return 201 with the user ID 44', async () => {
        const newFlashcardSet = {
            title: 'Test Set',
            description: 'Test Description',
            flashcards: [
                { front: 'Front 1', back: 'Back 1', description: 'sup' },
                { front: 'Front 2', back: 'Back 2', description: 'sup' }
            ],
            is_public: true
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

    afterEach(async () => {
        if (setID) {
            // Delete the created flashcard set from the database after each test
            await supabase // delete flashcards with matching parent ID
                .from('flashcards')
                .delete()
                .match({ parent: setID })
            await supabase // delete flashcard set
                .from('flashcard_sets')
                .delete()
                .match({ id: setID });
        }
    });
  });