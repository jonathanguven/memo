import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { supabase } from '../supabase.js';

const router = express.Router();

// Add a new flashcard to an existing flashcard set
router.post('/flashcard-sets/:setId/flashcards', authenticate, async (req, res) => {
    const userId = req.id;
    const setId = req.params.setId;

    try {
        const { front, back, description } = req.body;

        const { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .select('id, user_id')
            .eq('id', setId)
            .single();

        if (flashcardSetError || !flashcardSet) {
            throw new Error('Flashcard set not found');
        }

        if (flashcardSet.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const { error: flashcardError } = await supabase
            .from('flashcards')
            .insert([
                {
                    front,
                    back,
                    description,
                    parent: setId
                }
            ]);

        if (flashcardError) {
            throw flashcardError;
        }

        res.status(201).json({ message: 'Flashcard added successfully', front, back });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a flashcard from an existing flashcard set
router.delete('/flashcard-sets/:setId/flashcards/:cardId', authenticate, async (req, res) => {
    const userId = req.id;
    const setId = req.params.setId;
    const cardId = req.params.cardId;

    try {
        const { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .select('id, user_id')
            .eq('id', setId)
            .single();

        if (flashcardSetError || !flashcardSet) {
            throw new Error('Flashcard set not found');
        }

        if (flashcardSet.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const { error: flashcardError } = await supabase
            .from('flashcards')
            .delete()
            .match({ id: cardId, parent: setId });

        if (flashcardError) {
            throw flashcardError;
        }

        res.status(200).json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit a flashcard's front and back content
router.put('/flashcard-sets/:setId/flashcards/:cardId', authenticate, async (req, res) => {
    const userId = req.id;
    const setId = req.params.setId;
    const cardId = req.params.cardId;

    try {
        const { front, back } = req.body;

        const { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .select('id, user_id')
            .eq('id', setId)
            .single();

        if (flashcardSetError || !flashcardSet) {
            throw new Error('Flashcard set not found');
        }

        if (flashcardSet.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const { error: flashcardError } = await supabase
            .from('flashcards')
            .update({
                front,
                back
            })
            .match({ id: cardId, parent: setId });

        if (flashcardError) {
            throw flashcardError;
        }

        res.status(200).json({ success: true, message: 'Flashcard updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default router;
