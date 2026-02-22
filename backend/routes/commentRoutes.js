const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. Add a new comment (With 1-per-device validation)
router.post('/add', async (req, res) => {
  const { post_id, name, avatar, text, device_id } = req.body;

  try {
    // Check if this device has already commented on this post
    const { data: existingComments, error: checkError } = await supabase
      .from('comments')
      .select('id')
      .eq('post_id', post_id)
      .eq('device_id', device_id);

    if (existingComments && existingComments.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already submitted predictions for this match!' });
    }

    // Insert new comment
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id, name, avatar, text, device_id, is_winner: false }]);

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Predictions submitted successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get all comments for a specific post
router.get('/post/:postId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', req.params.postId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. Update Winners
router.post('/update-winners', async (req, res) => {
  const { winnerIds } = req.body; // Array of selected comment IDs
  try {
    // First, reset all winners for safety (optional, but good practice if you want to swap winners)
    // Then set the selected ones to true
    const { error } = await supabase
      .from('comments')
      .update({ is_winner: true })
      .in('id', winnerIds);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Winners updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;