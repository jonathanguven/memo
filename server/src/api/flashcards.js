import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authenticate.js'
import { supabase } from '../supabase.js';

const router = express.Router();

// creating flashcard set endpoint
router.post('/', authenticate, async (req, res) => {
    const id = req.id; 
    try {
        const { title, description, flashcards, is_public } = req.body;
        let { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .insert([{ id, title, description, is_public }])
            .single();
        if (flashcardSetError) throw flashcardSetError;

        if (flashcards && flashcards.length > 0) {
            const childFlashcard = flashcards.map(card => ({
                ...card,
                flashcard_set_id: flashcardSet.id
            }));

            const { error: flashcardsError } = await supabase
                .from('flashcards')
                .insert(childFlashcard);
            if (flashcardsError) throw flashcardsError;
        }
        res.status(201).json({ message: 'Flashcard set created successfully', flashcardSet });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  });
  
  // Get a specific flashcard set
  router.get('/:id', authenticate, async (req, res) => {
    const id = req.id; 
    const setId = req.params.id;
    // ... logic to get the flashcard set if id matches ...
  });
  
  // Update a specific flashcard set
  router.put('/:id', authenticate, async (req, res) => {
    const id = req.id; 
    const setId = req.params.id;
    // ... logic to update the flashcard set if id matches ...
  });
  
  // Delete a specific flashcard set
  router.delete('/:id', authenticate, async (req, res) => {
    const id = req.id; 
    const setId = req.params.id;
    // ... logic to delete the flashcard set if id matches ...
  });

export default router;