import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiTrash2, FiAward, FiCheckCircle, FiXCircle, FiCornerDownRight } from 'react-icons/fi';

const LiveComments = () => {
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState([]);
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postRes = await axios.get('https://cricket-pro-three.vercel.app/api/posts/active');
        setActivePost(postRes.data);

        if (postRes.data && postRes.data.id) {
          const commentsRes = await axios.get(`https://cricket-pro-three.vercel.app/api/comments/${postRes.data.id}`);
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

  const handleSelect = (commentId) => {
    if (selectedComments.includes(commentId)) {
        setSelectedComments(selectedComments.filter(id => id !== commentId));
    } else {
        setSelectedComments([...selectedComments, commentId]);
    }
  };

  const markBulkWinners = async () => {
    if (selectedComments.length === 0) return alert("Please select at least one comment!");
    try {
      await Promise.all(selectedComments.map(id => 
          axios.put(`https://cricket-pro-three.vercel.app/api/comments/winner/${id}`)
      ));
      alert('Selected users marked as Winners!');
      setComments(comments.map(c => selectedComments.includes(c.id) ? { ...c, is_winner: true } : c));
      setSelectedComments([]); 
    } catch (err) {
      alert('Error marking winners');
    }
  };

  const unmarkWinner = async (commentId) => {
    try {
      await axios.put(`https://cricket-pro-three.vercel.app/api/comments/unmark-winner/${commentId}`);
      setComments(comments.map(c => c.id === commentId ? { ...c, is_winner: false } : c));
      alert('Winner status removed.');
    } catch (err) {
      alert('Error unmarking winner.');
    }
  };

  const deleteComment = async (commentId) => {
    if(!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`https://cricket-pro-three.vercel.app/api/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    } catch (err) {
      alert('Error deleting comment');
    }
  };

  const submitAdminReply = async (commentId) => {
      if(!replyText.trim()) return;
      try {
          await axios.put(`https://cricket-pro-three.vercel.app/api/comments/reply/${commentId}`, { reply: replyText });
          setComments(comments.map(c => c.id === commentId ? { ...c, admin_reply: replyText } : c));
          setReplyingTo(null);
          setReplyText('');
          alert('Reply sent successfully!');
      } catch (err) {
          console.error(err);
          alert('Error sending reply. Check if backend is updated.');
      }
  };

  if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading Comments...</div>;

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <FiMessageSquare className="text-neon-blue" /> Live Comments
          </h1>
          
          {selectedComments.length > 0 && (
             <div className="bg-slate-800 border border-cricket-gold px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-3 md:gap-4 shadow-[0_0_15px_rgba(255,215,0,0.2)] w-full md:w-auto justify-between">
                <span className="text-cricket-gold font-bold text-sm md:text-base">{selectedComments.length} Selected</span>
                <button onClick={markBulkWinners} className="bg-cricket-gold hover:bg-yellow-500 text-black px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 transition">
                   <FiAward/> Make Winners
                </button>
             </div>
          )}
      </div>

      {activePost ? (
        <div className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h2 className="text-sm md:text-lg font-bold text-slate-400 mb-2 line-clamp-1">Active Post: <span className="text-white">{activePost.title}</span></h2>
          <div className="border-t border-slate-700 my-4"></div>

          <div className="space-y-4"> 
            {comments.length > 0 ? comments.map((comment, index) => (
              
              <div key={comment.id} className={`p-3 md:p-5 rounded-xl border flex flex-col transition-all duration-300 ${
                      comment.is_winner ? 'bg-green-900/10 border-green-500/50' : 
                      selectedComments.includes(comment.id) ? 'bg-slate-700/50 border-cricket-gold' : 'bg-slate-900 border-slate-700'
                  }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4">
                    <div className="flex items-start gap-3 md:gap-4 overflow-hidden w-full">
                        {!comment.is_winner && (
                            <div className="pt-1 shrink-0">
                                <input type="checkbox" checked={selectedComments.includes(comment.id)} onChange={() => handleSelect(comment.id)} className="w-4 h-4 md:w-5 md:h-5 rounded bg-slate-800 cursor-pointer" />
                            </div>
                        )}

                        <div className="min-w-0 flex-1 w-full">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-white shrink-0">{comment.avatar}</div>
                            <p className="font-bold text-base text-neon-blue truncate max-w-[150px] md:max-w-none">{comment.name}</p>
                            
                            {index === 0 && <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">First</span>}
                            {comment.is_vip && <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">VIP</span>}
                            {comment.is_winner && <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><FiCheckCircle/> Winner</span>}
                          </div>
                          
                          <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 whitespace-pre-line break-words w-full">
                              {comment.text}
                          </p>

                          {comment.admin_reply && (
                              <div className="mt-3 ml-2 md:ml-4 p-3 bg-cricket-gold/10 border border-cricket-gold/30 rounded-lg text-sm text-slate-300 relative w-full md:w-[90%]">
                                  <span className="absolute -top-2 left-2 bg-cricket-gold text-black text-[10px] font-bold px-1 rounded">Admin Replied</span>
                                  <FiCornerDownRight className="inline text-cricket-gold mr-2"/>
                                  {comment.admin_reply}
                              </div>
                          )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                      <button onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(''); }} className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-400 rounded-lg text-sm font-semibold transition">
                         Reply
                      </button>

                      {comment.is_winner && (
                         <button onClick={() => unmarkWinner(comment.id)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition">
                            <FiXCircle className="text-base"/> <span className="hidden md:inline">Unmark</span>
                         </button>
                      )}

                      <button onClick={() => deleteComment(comment.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                </div>

                {/* Mobile Friendly Reply Box */}
                {replyingTo === comment.id && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full pl-0 sm:pl-12">
                        <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type admin reply..." className="w-full flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:border-neon-blue outline-none"/>
                        <button onClick={() => submitAdminReply(comment.id)} className="w-full sm:w-auto bg-cricket-gold text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-yellow-500 transition">Send</button>
                    </div>
                )}
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