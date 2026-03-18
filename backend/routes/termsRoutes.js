const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('terms').select('*').limit(1).single();
        
        // Table එක නැත්නම් හෝ Data නැත්නම් Crash වෙන්නේ නැතුව Default එක යවනවා
        if (error && error.code === 'PGRST116') {
             return res.json({ content: '["Welcome to Cricket Pro. These are the default terms and conditions."]' });
        } else if (error) {
             throw error;
        }

        res.json(data);
    } catch (err) {
        console.error("Fetch Terms Error:", err);
        res.status(500).json({ message: err.message, error: "Database error" });
    }
});

router.put('/', async (req, res) => {
    try {
        const { data: existingData } = await supabase.from('terms').select('id').limit(1).single();

        let result;
        if (existingData) {
            result = await supabase.from('terms').update({ content: req.body.content, updated_at: new Date() }).eq('id', existingData.id).select();
        } else {
            result = await supabase.from('terms').insert([{ content: req.body.content }]).select();
        }

        if (result.error) throw result.error;
        res.json({ success: true, message: 'Terms updated successfully!' });
    } catch (err) {
        console.error("Update Terms Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;