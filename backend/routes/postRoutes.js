const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

// 1. POST - Create a new post
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { title, questions, prizes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    const { data: storageData, error: storageError } = await supabase
      .storage.from('post-images').upload(fileName, file.buffer, { contentType: file.mimetype });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
    const imagePath = publicUrlData.publicUrl;

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

// 2. GET - Fetch ONLY the active post
router.get('/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('isActive', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(); // Eka post ekak witharak gannawa

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 kiyanne 'No rows found' ekata (eka error ekak nemei apita)
    res.status(200).json(data || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. GET - Fetch History (Inactive posts)
router.get('/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('isActive', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 4. DELETE - Delete a post and clear all related data (comments & winners)
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // 1. මේ පෝස්ට් එකට අදාල ඔක්කොම Comments මකලා දානවා
    await supabase.from('comments').delete().eq('post_id', postId);

    // 2. ඊළඟ මැච් එකට අලුත් අයට චාන්ස් දෙන්න කලින් Winners ලාවත් ඔක්කොම මකනවා
    // (neq ID 0 කරලා තියෙන්නේ table එකේ ඔක්කොම රෙකෝඩ්ස් අයින් කරන්නයි)
    await supabase.from('winners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 3. අන්තිමට Post එක මකනවා
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Post and all related data cleaned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
});

module.exports = router;