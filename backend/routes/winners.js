const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. Get Pending
router.get('/pending', async (req, res) => {
  try {
    const { data, error } = await supabase.from('winners').select('*').eq('status', 'pending');
    if (error) throw error;
    res.json(data || []);
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 2. Get Published
router.get('/published', async (req, res) => {
  try {
    const { data, error } = await supabase.from('winners').select('*').eq('status', 'published');
    if (error) throw error;
    res.json(data || []);
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 3. Publish Winner
router.put('/publish/:id', async (req, res) => {
  try {
    const { name, prize, prize_value } = req.body;
    const { data, error } = await supabase.from('winners').update({ name, prize, prize_value, status: 'published' }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 4. Custom Winner
router.post('/custom', async (req, res) => {
  try {
    const { name, prize, prize_value } = req.body;
    const { data, error } = await supabase.from('winners').insert([{ name, prize, prize_value, status: 'published' }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 5. Edit Winner (අලුතින් දැම්මේ)
router.put('/edit/:id', async (req, res) => {
  try {
    const { name, prize, prize_value } = req.body;
    const { error } = await supabase.from('winners').update({ name, prize, prize_value }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 6. Delete Winner (අලුතින් දැම්මේ)
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('winners').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

module.exports = router;