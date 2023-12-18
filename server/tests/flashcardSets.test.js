// grab all public flashcard sets
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import flashcardSets from '../src/api/publicSets.js';
import { supabase } from '../src/supabase.js';

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api', flashcardSets);

describe('GET /flashcards', () => {

    it('should retrieve all public flashcard sets', async () => {
        const response = await supertest(app)
            .get('/api/flashcards');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.flashcardSets)).toBe(true);
        response.body.flashcardSets.forEach(set => {
            expect(set.is_private).toBe(false);
        });
    });
});
