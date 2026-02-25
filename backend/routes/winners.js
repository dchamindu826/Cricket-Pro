const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Pending Winners
router.get('/pending', async (req, res) => {
  try {
    const { data, error } = await supabase.from('winners').select('*').eq('status', 'pending');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending winners" });
  }
});

// Published Winners (Site එකට)
router.get('/published', async (req, res) => {
  try {
    const { data, error } = await supabase.from('winners').select('*').eq('status', 'published').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching published winners" });
  }
});

// Pending කෙනෙක්ව Publish කිරීම
router.put('/publish/:id', async (req, res) => {
  try {
    const { name, prize, prize_value } = req.body;
    const { data, error } = await supabase
      .from('winners')
      .update({ name, prize, prize_value: prize_value || 0, status: 'published' })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: "Error publishing winner" });
  }
});

// අලුතින් Custom Winner කෙනෙක් දාන්න
router.post('/custom', async (req, res) => {
    try {
      const { name, prize, prize_value } = req.body;
      const { data, error } = await supabase
        .from('winners')
        .insert([{ name, prize, prize_value: prize_value || 0, status: 'published' }])
        .select();
      
      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } catch (error) {
      res.status(500).json({ message: "Error adding custom winner" });
    }
});

module.exports = router;