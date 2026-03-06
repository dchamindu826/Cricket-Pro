const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

let currentLiveStreamUrl = "https://www.youtube.com/embed/...";

// Frontend එක Load වෙද්දි Site Visit එකක් Record කරන්න
router.get('/track-visit', async (req, res) => {
  try {
    await supabase.from('site_traffic').insert([{}]);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false });
  }
});

// 1. Dashboard Stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const { count: pendingOrders } = await supabase.from('vip_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: vipMembers } = await supabase.from('vip_orders').select('*', { count: 'exact', head: true }).eq('status', 'approved');

    const { data: activePost } = await supabase.from('posts').select('id').eq('isActive', true).single();
    let activePostComments = 0;
    if (activePost) {
      const { count } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', activePost.id);
      activePostComments = count || 0;
    }

    const { data: winnersData } = await supabase.from('winners').select('prize_value').eq('status', 'published');
    let totalPrizesGiven = 0;
    if (winnersData) {
        totalPrizesGiven = winnersData.reduce((sum, item) => sum + (Number(item.prize_value) || 0), 0);
    }

    const vipRevenue = (vipMembers || 0) * 1000; 

    const { count: totalTraffic } = await supabase.from('site_traffic').select('*', { count: 'exact', head: true });

    const fiveMinsAgo = new Date(Date.now() - 5 * 60000).toISOString();
    const { count: liveUsers } = await supabase.from('site_traffic').select('*', { count: 'exact', head: true }).gte('visited_at', fiveMinsAgo);

    res.json({
      liveUsers: liveUsers || 0,
      totalTraffic: totalTraffic || 0,
      pendingOrders: pendingOrders || 0,
      vipMembers: vipMembers || 0,
      activePostComments,
      vipRevenue,
      totalPrizesGiven
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// 2. Chart Data
router.get('/revenue-chart', async (req, res) => {
  try {
    const { data: orders } = await supabase.from('vip_orders').select('created_at').eq('status', 'approved');
      
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for(let i=4; i>=0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        chartData.push({ name: days[d.getDay()], revenue: 0 });
    }

    if(orders) {
        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const dayName = days[orderDate.getDay()];
            const chartItem = chartData.find(item => item.name === dayName);
            if(chartItem) {
                chartItem.revenue += 1000; 
            }
        });
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json([]);
  }
});

// 3. YouTube Live link
router.get('/live-stream', (req, res) => {
  res.json({ url: currentLiveStreamUrl });
});

router.post('/live-stream', (req, res) => {
  if(req.body.url) {
      currentLiveStreamUrl = req.body.url;
      res.json({ success: true, message: "Link updated successfully" });
  } else {
      res.status(400).json({ success: false, message: "URL is required" });
  }
});

// ==========================================
// ACTIVE MATCH ROUTES (මෙහි තමයි 404 Error එක හැදෙන්නේ)
// ==========================================

router.get('/active-match', async (req, res) => {
  try {
    const { data, error } = await supabase.from('app_settings').select('active_match_id').eq('id', 1).single();
    res.json({ match_id: data ? data.active_match_id : '' });
  } catch (error) { 
    // Setting table එක නැත්නම් හිස් එකක් යවනවා Error නොදී
    res.json({ match_id: '' }); 
  }
});

router.post('/active-match', async (req, res) => {
  try {
    const { match_id } = req.body;
    // Upsert කරනවා (තිබ්බොත් Update වෙනවා, නැත්නම් අලුතින් හැදෙනවා)
    const { error } = await supabase.from('app_settings').upsert({ id: 1, active_match_id: match_id });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { 
    res.status(500).json({ message: "Error saving active match" }); 
  }
});

// ==========================================
// ADMIN USER MANAGEMENT ROUTES
// ==========================================

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase.from('admins').select('*').eq('username', username).eq('password', password).single();
    if (data) {
      res.json({ success: true, user: data.username });
    } else {
      res.status(401).json({ success: false, message: "Invalid Username or Password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('admins').select('id, username, created_at').order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
});

router.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase.from('admins').insert([{ username, password }]).select('id, username, created_at');
    if (error) {
      if (error.code === '23505') return res.status(400).json({ message: "Username already exists!" });
      throw error;
    }
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
});

router.put('/users/:id', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase.from('admins').update({ username, password }).eq('id', req.params.id).select('id, username, created_at');
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin" });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('admins').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin" });
  }
});

module.exports = router;