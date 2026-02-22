import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiImage } from 'react-icons/fi';

const ManagePosts = () => {
  // Form States
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(['']);
  const [prizes, setPrizes] = useState([{ place: '1st', amount: '' }]);
  
  // Listed Posts State
  const [postsList, setPostsList] = useState([]);

  // Fetch Posts on Load
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPostsList(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addQuestion = () => {
    if (questions.length < 5) setQuestions([...questions, '']);
  };

  const removeQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const updateQuestion = (text, index) => {
    const newQ = [...questions];
    newQ[index] = text;
    setQuestions(newQ);
  };

  const addPrize = () => {
    if (prizes.length < 3) {
      const places = ['1st', '2nd', '3rd'];
      setPrizes([...prizes, { place: places[prizes.length], amount: '' }]);
    }
  };

  const updatePrize = (amount, index) => {
    const newP = [...prizes];
    newP[index].amount = amount;
    setPrizes(newP);
  };

  // Create Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) return alert("Match Title and Banner Image are required!");

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    
    const validQuestions = questions.filter(q => q.trim() !== '');
    formData.append('questions', JSON.stringify(validQuestions));
    
    const validPrizes = prizes.filter(p => p.amount.trim() !== '');
    formData.append('prizes', JSON.stringify(validPrizes));

    try {
      const response = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Post Published Successfully! 🚀");
        setTitle(''); setImage(null); setQuestions(['']); setPrizes([{ place: '1st', amount: '' }]);
        fetchPosts(); // Refresh the list
      } else {
        alert("Failed to publish post: " + data.message);
      }
    } catch (error) {
      alert("Error publishing post. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  // Delete Post (Requires Backend DELETE route to fully work)
  const handleDeletePost = async (id) => {
      if(!window.confirm("Are you sure you want to delete this post?")) return;
      try {
          const response = await fetch(`http://localhost:5000/api/posts/${id}`, { method: 'DELETE' });
          const data = await response.json();
          if(data.success) {
              setPostsList(postsList.filter(p => p.id !== id));
          } else {
              alert("Failed to delete post.");
          }
      } catch (error) {
          alert("Error deleting post.");
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. CREATE POST SECTION */}
      <div className="bg-[#0b1b36] rounded-3xl border border-slate-700/50 p-8 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-6 tracking-wide">Create New Prediction Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title & Image */}
          <div className="space-y-5 border-b border-slate-700 pb-8">
              <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">Match Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. IND vs SL T20 Final" 
                    className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors" 
                    required
                  />
              </div>
              <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">Match Banner Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-slate-700 file:text-white file:font-bold hover:file:bg-slate-600 transition-colors" 
                    required
                  />
              </div>
          </div>

          {/* Dynamic Questions */}
          <div className="space-y-4 border-b border-slate-700 pb-8">
              <div className="flex justify-between items-center">
                  <label className="text-slate-200 font-bold text-lg">Questions ({questions.length}/5)</label>
                  {questions.length < 5 && (
                      <button type="button" onClick={addQuestion} className="bg-neon-blue/10 text-neon-blue px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-neon-blue hover:text-[#020c1b] transition-colors">
                          <FiPlus /> Add Question
                      </button>
                  )}
              </div>
              
              {questions.map((q, index) => (
                  <div key={index} className="flex items-center gap-4">
                      <span className="bg-slate-800 text-slate-400 w-10 h-10 rounded-lg flex items-center justify-center font-black">{index + 1}</span>
                      <input 
                          type="text" 
                          value={q}
                          onChange={(e) => updateQuestion(e.target.value, index)}
                          placeholder={`Question ${index + 1}...`} 
                          className="flex-1 bg-[#020c1b] border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors" 
                          required
                      />
                      {questions.length > 1 && (
                          <button type="button" onClick={() => removeQuestion(index)} className="text-red-400 hover:bg-red-500/20 p-3 rounded-xl transition-colors"><FiTrash2 size={20}/></button>
                      )}
                  </div>
              ))}
          </div>

          {/* Dynamic Prizes */}
          <div className="space-y-4 border-b border-slate-700 pb-8">
              <div className="flex justify-between items-center">
                  <label className="text-slate-200 font-bold text-lg">Winning Prizes (Optional)</label>
                  {prizes.length < 3 && (
                      <button type="button" onClick={addPrize} className="bg-cricket-gold/10 text-cricket-gold px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-cricket-gold hover:text-[#020c1b] transition-colors">
                          <FiPlus /> Add Prize
                      </button>
                  )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {prizes.map((prize, index) => (
                      <div key={index}>
                          <label className="block text-slate-500 text-xs font-bold mb-2">{prize.place} Prize Amount</label>
                          <input 
                            type="text" 
                            value={prize.amount}
                            onChange={(e) => updatePrize(e.target.value, index)}
                            placeholder="e.g. Rs. 5000" 
                            className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-cricket-gold transition-colors" 
                          />
                      </div>
                  ))}
              </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full md:w-auto px-10 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
              loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-neon-blue to-[#00b3cc] text-[#020c1b] hover:shadow-[0_0_25px_rgba(100,255,218,0.4)]'
            }`}
          >
              <FiSave size={20} /> {loading ? 'Publishing...' : 'Publish Post to Website'}
          </button>
        </form>
      </div>

      {/* 2. LISTED POSTS SECTION */}
      <div>
          <h2 className="text-2xl font-black text-white mb-6">Published Posts History</h2>
          <div className="space-y-4">
              {postsList.length === 0 ? (
                  <p className="text-slate-500 bg-slate-800/50 p-6 rounded-2xl text-center border border-slate-700 border-dashed">No posts published yet.</p>
              ) : (
                  postsList.map((post) => (
                      <div key={post.id} className="bg-[#0b1b36] p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center gap-6 shadow-lg group">
                          <img src={post.imagePath} alt={post.title} className="w-full md:w-48 h-24 object-cover rounded-xl border border-slate-600" />
                          <div className="flex-1 w-full">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-lg text-white">{post.title}</h3>
                                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-slate-400 mb-2">{post.questions.length} Questions Included</p>
                          </div>
                          <div className="flex w-full md:w-auto justify-end">
                              <button onClick={() => handleDeletePost(post.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors w-full md:w-auto justify-center">
                                  <FiTrash2 /> Delete
                              </button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

    </div>
  );
};

export default ManagePosts;