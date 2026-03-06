const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/add', async (req, res) => {
  const { post_id, name, avatar, text, device_id, is_vip } = req.body;
  if (!post_id || !name || !text || !device_id) return res.status(400).json({ success: false, message: 'Missing required fields.' });

  try {
    const { data: existingComment } = await supabase.from('comments').select('id').eq('post_id', post_id).eq('device_id', device_id).single();
    if (existingComment) return res.status(400).json({ success: false, message: 'You have already submitted a prediction for this post!' });

    const { error } = await supabase.from('comments').insert([{ post_id, name, avatar, text, device_id, is_vip, is_winner: false }]);
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Prediction submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const { data, error } = await supabase.from('comments').select('*').eq('post_id', req.params.postId).order('created_at', { ascending: true });
    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/winner/:id', async (req, res) => {
  try {
    const { data: commentData, error: commentError } = await supabase.from('comments').update({ is_winner: true }).eq('id', req.params.id).select().single();
    if (commentError) throw commentError;

    if (commentData) {
      await supabase.from('winners').insert([{ name: commentData.name || 'User', status: 'pending' }]);
    }
    res.status(200).json({ success: true, message: 'Marked as winner!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking winner' });
  }
});

router.put('/unmark-winner/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('comments').update({ is_winner: false }).eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Unmarked successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error unmarking winner' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting comment' });
  }
});

// Admin Reply Route එක (මේක තමයි 404 ආවේ)
router.put('/reply/:id', async (req, res) => {
    try {
        const { reply } = req.body;
        const { data, error } = await supabase.from('comments').update({ admin_reply: reply }).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.status(200).json({ success: true, message: 'Reply added successfully', data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding reply' });
    }
});

// Reactions Route
router.put('/react/:id', async (req, res) => {
    try {
        const { type } = req.body; 
        const { data: currentData, error: fetchError } = await supabase.from('comments').select('reactions').eq('id', req.params.id).single();
        if (fetchError) throw fetchError;

        let reactions = currentData.reactions || {};
        reactions[type] = (reactions[type] || 0) + 1; 

        const { data, error } = await supabase.from('comments').update({ reactions }).eq('id', req.params.id).select().single();
        if (error) throw error;
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error reacting' });
    }
});

module.exports = router;