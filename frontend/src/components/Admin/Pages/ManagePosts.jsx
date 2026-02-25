import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit, FiAward, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

const ManagePosts = () => {
  // === CREATE POST STATES ===
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [questions, setQuestions] = useState([{ id: 1, text: '' }]);
  const [prizes, setPrizes] = useState([{ id: 1, title: '', price: '' }]);

  // === REAL DATA STATES ===
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [previousPosts, setPreviousPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        // 1. Fetch Active Post
        const activeRes = await axios.get('http://localhost:5000/api/posts/active');
        setActivePost(activeRes.data);

        // 2. Fetch Comments if active post exists (Make sure commentRoutes is working backend)
        if (activeRes.data && activeRes.data.id) {
          try {
             const commentsRes = await axios.get(`http://localhost:5000/api/comments/${activeRes.data.id}`);
             setComments(commentsRes.data || []);
          } catch(err) {
             console.log("No comments or route error", err);
          }
        }

        // 3. Fetch Previous Posts
        const historyRes = await axios.get('http://localhost:5000/api/posts/history');
        setPreviousPosts(historyRes.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts data:", error);
        setLoading(false);
      }
    };

    fetchPostsData();
  }, []);

  const addQuestion = () => {
    if (questions.length < 15) setQuestions([...questions, { id: Date.now(), text: '' }]);
  };
  const updateQuestion = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addPrize = () => {
    if (prizes.length < 5) setPrizes([...prizes, { id: Date.now(), title: '', price: '' }]);
  };
  const updatePrize = (id, field, value) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const removePrize = (id) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  // SUBMIT NEW POST
  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postTitle);
    if(postImage) formData.append('image', postImage);
    
    // Convert to JSON strings for backend
    formData.append('questions', JSON.stringify(questions));
    formData.append('prizes', JSON.stringify(prizes));

    try {
      await axios.post('http://localhost:5000/api/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('New post created successfully!');
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    }
  };

  // DELETE ACTIVE POST
  const handleDeleteActivePost = async () => {
    if(!window.confirm("Are you sure you want to delete the active post?")) return;
    try {
      // Supabase uses 'id' not '_id'
      await axios.delete(`http://localhost:5000/api/posts/${activePost.id}`);
      setActivePost(null);
      setComments([]);
      alert('Post deleted!');
    } catch (err) {
      alert('Error deleting post');
    }
  };

  if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading Posts Data...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto text-slate-200">
      <h1 className="text-3xl font-black text-white mb-8">Manage Posts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === LEFT: CREATE POST === */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit shadow-lg">
          <h2 className="text-xl font-bold text-neon-blue mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-6">
            
            <div>
              <label className="block text-sm mb-1 text-slate-400">Post Title</label>
              <input type="text" value={postTitle} onChange={(e)=>setPostTitle(e.target.value)} required className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none" placeholder="Enter title..." />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-400">Upload Image</label>
              <input type="file" onChange={(e)=>setPostImage(e.target.files[0])} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white" />
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-white">Questions ({questions.length}/15)</label>
                {questions.length < 15 && (
                  <button type="button" onClick={addQuestion} className="text-xs bg-neon-blue text-slate-900 px-3 py-1 rounded font-bold"><FiPlus className="inline"/> Add Q</button>
                )}
              </div>
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 font-bold w-6">Q{index + 1}</span>
                  <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, e.target.value)} placeholder="Type question..." className="flex-1 bg-slate-800 border border-slate-600 rounded-md p-2 text-sm outline-none" required />
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-500"><FiTrash2 size={18}/></button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
               <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-white">Prizes & Awards ({prizes.length}/5)</label>
                {prizes.length < 5 && (
                  <button type="button" onClick={addPrize} className="text-xs bg-cricket-gold text-slate-900 px-3 py-1 rounded font-bold"><FiPlus className="inline"/> Add Prize</button>
                )}
              </div>
              {prizes.map((p, index) => (
                <div key={p.id} className="flex flex-col sm:flex-row items-center gap-2 mb-3 bg-slate-800 p-2 rounded-lg">
                  <span className="text-cricket-gold font-bold w-6 hidden sm:block">#{index + 1}</span>
                  <input type="text" value={p.title} onChange={(e) => updatePrize(p.id, 'title', e.target.value)} placeholder="Title (e.g. 1st Place)" className="w-full sm:flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm outline-none" required />
                  <input type="number" value={p.price} onChange={(e) => updatePrize(p.id, 'price', e.target.value)} placeholder="Price/Value" className="w-full sm:w-1/3 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm outline-none" />
                  {prizes.length > 1 && (
                    <button type="button" onClick={() => removePrize(p.id)} className="text-red-400 p-2"><FiTrash2 size={18}/></button>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-neon-blue text-slate-900 font-black py-3 rounded-xl">
              Launch Post
            </button>
          </form>
        </div>


        {/* === RIGHT: ACTIVE POST === */}
        <div className="space-y-6">
          {activePost ? (
            <div className="bg-[#050f20] p-6 rounded-2xl border border-cricket-gold shadow-[0_0_15px_rgba(255,215,0,0.1)] relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={handleDeleteActivePost} className="bg-red-500/20 text-red-500 p-2 rounded hover:bg-red-500 hover:text-white transition"><FiTrash2/></button>
              </div>
              <span className="bg-green-500 text-black text-xs font-black px-2 py-1 rounded-sm uppercase mb-3 inline-block">Live Active Post</span>
              <h3 className="text-xl font-bold text-white mb-2">{activePost.title}</h3>
              
              {/* Image Preview */}
              {activePost.imagePath && (
                 <img src={activePost.imagePath} alt="Post" className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
              )}

              <p className="text-slate-400 text-sm mb-4">
                 {Array.isArray(activePost.questions) ? activePost.questions.length : 0} Questions • 
                 {Array.isArray(activePost.prizes) ? activePost.prizes.length : 0} Prizes
              </p>
              
              <div className="mt-4 border-t border-slate-700 pt-4">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2"><FiMessageSquare/> Live Comments</h4>
                
                <div className="h-[250px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-600">
                  {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment.id || comment._id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-neon-blue mb-1">{comment.user?.name || 'User'}</p>
                        <p className="text-sm text-slate-300">{comment.text}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500 text-sm italic">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 p-6 rounded-2xl border border-dashed border-slate-600 text-center py-10">
               <p className="text-slate-400">No active post currently. Create one from the left panel.</p>
            </div>
          )}

          {/* === PREVIOUS POSTS === */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Previous Posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previousPosts.length > 0 ? previousPosts.map(post => (
                <div key={post.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 relative group">
                  <p className="text-xs text-slate-400 mb-1">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-white pr-6 line-clamp-2">{post.title}</p>
                </div>
              )) : (
                <p className="text-slate-500 text-sm">No previous posts found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagePosts;