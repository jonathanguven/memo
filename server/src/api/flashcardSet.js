import express from 'express';
import { authenticate } from '../middleware/authenticate.js'
import { supabase } from '../supabase.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

// creating flashcard set 
router.post('/flashcard-sets', authenticate, async (req, res) => {
	const userId = req.id; 
	try {
		const { title, description, flashcards, is_private } = req.body;
		let { data: flashcardSet, error: flashcardSetError } = await supabase
			.from('flashcard_sets')
			.insert([{ user_id: userId, title, description, is_private }])
			.select();
		if (flashcardSetError) throw flashcardSetError;
		
		if (flashcards && flashcards.length > 0) {
			for (let card of flashcards) {
				const { error: flashcardError } = await supabase
					.from('flashcards')
					.insert([{
						front: card.front,
						back: card.back,
						description: card.description,
						parent: flashcardSet[0].id,
					}]);
				if (flashcardError) throw flashcardError;
			}
		}
		res.status(201).json({ message: 'Flashcard set created successfully', flashcardSet });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Get a specific flashcard set and corresponding flashcards
router.get('/flashcard-sets/:id', async (req, res) => {
	const setId = req.params.id;
	let userId;

	const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (error) {
            res.status(401).json({ message: 'Invalid token.' });
        }
    }

	try {
		const { data: flashcardSet, error } = await supabase
			.from('flashcard_sets')
			.select(`
				id,
				title,
				description,
				created_at, 
				updated_at,
				is_private,
				user_id,
				users (username),
				flashcards (
					id, 
					front, 
					back, 
					description
				) 
			`)
			.eq('id', setId)
			.single();

		// no flashcard set found
		if (!flashcardSet) {
			return res.status(404).json({ message: 'Flashcard set not found!' })
		}

		// check for public or if user is owner
		if (flashcardSet.is_private && flashcardSet.user_id !== userId) {
			return res.status(403).json({ message: 'You do not have access to this page!' });
		}

		// return flashcard set
		res.status(200).json({ flashcardSet });

	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Update a specific flashcard set - make public and private
router.put('/flashcard-sets/:id', authenticate, async (req, res) => {
	const userId = req.id; 
	const setId = req.params.id;
	
	try {
        const { data: existingSet, error: fetchError } = await supabase
            .from('flashcard_sets')
            .select('is_private, user_id')
            .eq('id', setId)
            .single();

        if (fetchError) throw fetchError;

        if (!existingSet) {
            return res.status(404).json({ message: 'Flashcard set not found!' });
        }
        if (existingSet.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const newIsPrivate = !existingSet.is_private;

        const { error: updateError } = await supabase
            .from('flashcard_sets')
            .update({ is_private: newIsPrivate })
            .match({ id: setId });

        if (updateError) throw updateError;

        res.status(200).json({ message: 'Flashcard set updated successfully', is_private: newIsPrivate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a specific flashcard set - update title
router.put('/flashcard-sets/:id/update-title', authenticate, async (req, res) => {
	const setId = req.params.id;
	console.log('body')
	console.log(req.body)
	const { title } = req.body;
	
	try {
        const { error } = await supabase
            .from('flashcard_sets')
            .update({ title })
            .match({ id: setId });

        if (error) throw error;

        res.json({ success: true, message: `Title updated successfully to ${title}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update the title', error: error.message });
    }
});

// Delete a specific flashcard set
router.delete('/flashcard-sets/:id', authenticate, async (req, res) => {
	const userId = req.id; 
	const setId = req.params.id;
	try {
		const { data: flashcardSet, error: fetchError } = await supabase
            .from('flashcard_sets')
            .select('user_id')
            .eq('id', setId)
            .single();

        if (fetchError) throw fetchError;

		// check for unauthorized user
        if (flashcardSet.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

		const { error: flashcardError } = await supabase
			.from('flashcards')
			.delete()
			.match({ parent: setId })
		
		if (flashcardError) throw flashcardError;

		const { error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .delete()
            .match({ id: setId });

        if (flashcardSetError) throw flashcardSetError;

		// delete success message
		res.status(200).json({ message: 'Successfully Deleted!' });

	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;