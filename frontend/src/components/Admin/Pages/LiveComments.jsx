import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiTrash2, FiAward, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const LiveComments = () => {
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Bulk Selection State
  const [selectedComments, setSelectedComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postRes = await axios.get('http://localhost:5000/api/posts/active');
        setActivePost(postRes.data);

        if (postRes.data && postRes.data.id) {
          const commentsRes = await axios.get(`http://localhost:5000/api/comments/${postRes.data.id}`);
          setComments(commentsRes.data || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Handle Checkbox Selection
  const handleSelect = (commentId) => {
    if (selectedComments.includes(commentId)) {
        setSelectedComments(selectedComments.filter(id => id !== commentId));
    } else {
        setSelectedComments([...selectedComments, commentId]);
    }
  };

  // Bulk Mark as Winner
  const markBulkWinners = async () => {
    if (selectedComments.length === 0) return alert("Please select at least one comment!");
    
    try {
      await Promise.all(selectedComments.map(id => 
          axios.put(`http://localhost:5000/api/comments/winner/${id}`)
      ));
      
      alert('Selected users marked as Winners!');
      setComments(comments.map(c => selectedComments.includes(c.id) ? { ...c, is_winner: true } : c));
      setSelectedComments([]); 
    } catch (err) {
      alert('Error marking winners');
    }
  };

  // Unmark Winner (Single) 
  const unmarkWinner = async (commentId) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/unmark-winner/${commentId}`);
      setComments(comments.map(c => c.id === commentId ? { ...c, is_winner: false } : c));
      alert('Winner status removed.');
    } catch (err) {
      alert('Error unmarking winner. Ensure backend route exists.');
    }
  };

  // Delete Single Comment
  const deleteComment = async (commentId) => {
    if(!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    } catch (err) {
      alert('Error deleting comment');
    }
  };

  if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading Comments...</div>;

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto text-slate-200">
      
      {/* Header & Bulk Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <FiMessageSquare className="text-neon-blue" /> Live Comments
          </h1>
          
          {selectedComments.length > 0 && (
             <div className="bg-slate-800 border border-cricket-gold px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-3 md:gap-4 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <span className="text-cricket-gold font-bold text-sm md:text-base">{selectedComments.length} Selected</span>
                <button 
                   onClick={markBulkWinners}
                   className="bg-cricket-gold hover:bg-yellow-500 text-black px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 transition"
                >
                   <FiAward/> Make Winners
                </button>
             </div>
          )}
      </div>

      {activePost ? (
        <div className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h2 className="text-sm md:text-lg font-bold text-slate-400 mb-2 line-clamp-1">Active Post: <span className="text-white">{activePost.title}</span></h2>
          <div className="border-t border-slate-700 my-4"></div>

          {/* Comment List - Spacing reduced for mobile */}
          <div className="space-y-3"> 
            {comments.length > 0 ? comments.map((comment, index) => (
              
              <div 
                  key={comment.id} 
                  // Padding adu kala mobile eke ida ganna
                  className={`p-3 md:p-4 rounded-xl border flex flex-col sm:flex-row justify-between gap-3 md:gap-4 transition-all duration-300 ${
                      comment.is_winner 
                          ? 'bg-green-900/10 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                          : selectedComments.includes(comment.id)
                              ? 'bg-slate-700/50 border-cricket-gold shadow-[0_0_10px_rgba(255,215,0,0.2)] scale-[1.01]'
                              : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
              >
                
                {/* Left Side: Checkbox & Content */}
                <div className="flex items-start gap-3 md:gap-4 overflow-hidden">
                    {/* Checkbox */}
                    {!comment.is_winner && (
                        <div className="pt-1 shrink-0">
                            <input 
                                type="checkbox" 
                                checked={selectedComments.includes(comment.id)}
                                onChange={() => handleSelect(comment.id)}
                                className="w-4 h-4 md:w-5 md:h-5 rounded border-slate-600 text-cricket-gold focus:ring-cricket-gold bg-slate-800 cursor-pointer"
                            />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs md:text-sm text-white shrink-0">
                            {comment.avatar}
                        </div>
                        <p className="font-bold text-sm md:text-base text-neon-blue truncate max-w-[150px] md:max-w-none">{comment.name}</p>
                        
                        {/* Badges - Size optimized for mobile */}
                        {index === 0 && <span className="bg-emerald-500 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">First</span>}
                        {comment.is_vip && <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shadow-sm">VIP</span>}
                        {comment.is_winner && <span className="bg-green-500 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1"><FiCheckCircle/> Winner</span>}
                      </div>
                      
                      {/* Comment text - padding and text size reduced */}
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed bg-slate-800/50 p-2 md:p-3 rounded-lg border border-slate-700/50 whitespace-pre-line break-words">
                          {comment.text}
                      </p>
                    </div>
                </div>
                
                {/* Right Side: Actions (Aligned bottom right on mobile) */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center justify-end mt-1 sm:mt-0">
                  
                  {comment.is_winner && (
                     <button 
                        onClick={() => unmarkWinner(comment.id)}
                        className="px-2 py-1.5 md:px-3 md:py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 transition"
                        title="Remove Winner Status"
                     >
                        <FiXCircle className="text-sm md:text-base"/> <span className="hidden md:inline">Unmark</span>
                     </button>
                  )}

                  <button 
                    onClick={() => deleteComment(comment.id)}
                    className="p-1.5 md:p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition"
                    title="Delete Comment"
                  >
                    <FiTrash2 className="text-sm md:text-lg" />
                  </button>
                </div>

              </div>

            )) : (
              <p className="text-slate-500 text-center py-10">No comments on this post yet.</p>
            )}
          </div>
        </div>
      ) : (
         <div className="bg-slate-800 p-10 rounded-2xl border border-dashed border-slate-600 text-center">
             <p className="text-slate-400">No active post currently running.</p>
         </div>
      )}
    </div>
  );
};

export default LiveComments;