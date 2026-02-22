const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer Setup (Memory Storage - PC eke save nokara kelinma Supabase yawanna)
const upload = multer({ storage: multer.memoryStorage() });

// POST endpoint - Create a new post
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { title, questions, prizes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // 1. Upload image to Supabase Storage Bucket ('post-images')
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('post-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) throw storageError;

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(fileName);

    const imagePath = publicUrlData.publicUrl;

    // 2. Insert data into Supabase 'posts' table
    const { data: dbData, error: dbError } = await supabase
      .from('posts')
      .insert([
        {
          title,
          imagePath,
          questions: JSON.parse(questions),
          prizes: JSON.parse(prizes),
          isActive: true
        }
      ]);

    if (dbError) throw dbError;

    res.status(201).json({ success: true, message: 'Post created successfully!' });
    
  } catch (error) {
    console.error("Supabase Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
});

// GET endpoint - Fetch active posts
router.get('/', async (req, res) => {
  try {
    // Get posts ordered by creation time
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT endpoint - Update active post
router.put('/update/:id', async (req, res) => {
  const { title, questions } = req.body;
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        title: title, 
        questions: questions // JSON array eka
      })
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
});

module.exports = router;