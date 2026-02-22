const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. POST - Create a new VIP package
router.post('/create', async (req, res) => {
  const { name, price, features } = req.body;
  try {
    const { data, error } = await supabase
      .from('vip_packages')
      .insert([{ name, price, features }]);

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Package created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 2. GET - Fetch all packages
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vip_packages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. DELETE - Delete a package
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('vip_packages')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;