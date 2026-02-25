require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
  console.log("Testing connection to Supabase...");
  // ඔයාගේ තියෙන 'posts' වගේ table එකකින් එක row එකක් අරන් බලන්න ට්‍රයි කරනවා
  const { data, error } = await supabase.from('posts').select('*').limit(1);

  if (error) {
    console.error("❌ Connection failed:", error.message);
  } else {
    console.log("✅ Connection successful! Data received:", data);
  }
}

testConnection();