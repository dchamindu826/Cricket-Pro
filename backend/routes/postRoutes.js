const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.single('image'), async (req, res) => {
  try {
    // description එක අලුතින් ගත්තා
    const { title, description, questions, prizes } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ success: false, message: 'Image is required' });

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
          description, // DB එකට save කරනවා
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

router.get('/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('isActive', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json(data || null);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').eq('isActive', false).order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await supabase.from('comments').delete().eq('post_id', postId);
    await supabase.from('winners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Post and all related data cleaned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
});

module.exports = router;