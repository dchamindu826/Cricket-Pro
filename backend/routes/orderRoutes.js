const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// POST endpoint - Upload VIP Slip and Create Order
router.post('/create', upload.single('slipImage'), async (req, res) => {
  try {
    const { userName, userEmail, packageName } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ success: false, message: 'Payment slip is required' });

    // 1. Upload Slip to Supabase Storage ('payment-slips' bucket)
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    const { error: storageError } = await supabase
      .storage
      .from('payment-slips')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage.from('payment-slips').getPublicUrl(fileName);
    const slipUrl = publicUrlData.publicUrl;

    // 2. Save Order to Database
    const { error: dbError } = await supabase
      .from('vip_orders')
      .insert([{ user_name: userName, user_email: userEmail, package_name: packageName, slip_url: slipUrl }]);

    if (dbError) throw dbError;

    res.status(201).json({ success: true, message: 'VIP Request submitted successfully! Please wait for admin approval.' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET endpoint - Fetch pending VIP orders for Admin Dashboard
router.get('/pending', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vip_orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// PUT endpoint - Approve Order
router.put('/approve/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('vip_orders').update({ status: 'approved' }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Order Approved!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUT endpoint - Decline Order
router.put('/decline/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('vip_orders').update({ status: 'declined' }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Order Declined!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;