import React, { useState, useEffect } from 'react';
import { FiAward, FiLock, FiStar, FiClock, FiThumbsUp, FiHeart } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const PostSection = () => {
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [answers, setAnswers] = useState({});
  const [guestName, setGuestName] = useState('');
  const [hasSavedName, setHasSavedName] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPostAndComments = async () => {
    try {
      const postRes = await fetch('https://cricket-pro-three.vercel.app/api/posts/active');
      const currentPost = await postRes.json();
      
      if (currentPost && currentPost.id) {
          setActivePost(currentPost);

          const commentRes = await fetch(`https://cricket-pro-three.vercel.app/api/comments/${currentPost.id}`);
          const commentData = await commentRes.json();
          
          if (Array.isArray(commentData)) {
              setComments(commentData);
              const myDeviceId = localStorage.getItem('cric_device_id');
              if (myDeviceId && commentData.some(c => c.device_id === myDeviceId)) {
                  setHasCommented(true);
              }
          }
      } else {
          setActivePost(null);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
    
    let deviceId = localStorage.getItem('cric_device_id');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cric_device_id', deviceId);
    }

    const savedName = localStorage.getItem('saved_guest_name');
    if(savedName) {
        setGuestName(savedName);
        setHasSavedName(true); 
    }
  }, []);

  const handleAnswerChange = (index, value) => {
      setAnswers(prev => ({...prev, [index]: value}));
  };

  const submitComment = async () => {
      if (!activePost) return;
      if (hasCommented) return alert("You have already submitted predictions!");
      if (!guestName.trim()) return alert("Please enter your name!");
      
      const parsedQuestions = typeof activePost.questions === 'string' ? JSON.parse(activePost.questions) : activePost.questions;
      if (Object.keys(answers).length < parsedQuestions.length) {
          return alert("Please answer all questions before submitting.");
      }

      setSubmitting(true);
      const isVipUser = localStorage.getItem('is_vip') === 'true';
      const formattedAnswers = parsedQuestions.map((_, i) => `${i + 1}. ${answers[i] || ''}`).join('\n');

      const commentData = {
        post_id: activePost.id || activePost._id, 
        name: guestName,
        avatar: guestName.charAt(0).toUpperCase(),
        text: formattedAnswers,
        device_id: localStorage.getItem('cric_device_id'),
        is_vip: isVipUser
      };

      try {
          const response = await fetch('https://cricket-pro-three.vercel.app/api/comments/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(commentData)
          });
          
          const result = await response.json();
          if (result.success) {
              alert(result.message);
              fetchPostAndComments();
              setAnswers({});
              setHasCommented(true);
              localStorage.setItem('saved_guest_name', guestName);
              setHasSavedName(true); 
          } else {
              alert(result.message);
          }
      } catch (error) {
          alert("Error submitting predictions.");
      } finally {
          setSubmitting(false);
      }
  };

  const handleReact = async (commentId, type) => {
      try {
          const response = await fetch(`https://cricket-pro-three.vercel.app/api/comments/react/${commentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type })
          });
          if(response.ok) {
              const resData = await response.json();
              setComments(comments.map(c => c.id === commentId ? { ...c, reactions: resData.data.reactions } : c));
          }
      } catch (err) {
          console.error("Error reacting", err);
      }
  };

  if (loading) return <div id="posts" className="text-center text-neon-blue py-20 font-bold animate-pulse">Loading Live Prediction...</div>;

  if (!activePost) {
    return (
      <div id="posts" className="max-w-4xl mx-auto px-4 my-16 pt-10">
        <div className="bg-[#0b1b36]/80 backdrop-blur-md rounded-3xl border border-dashed border-neon-blue/40 overflow-hidden shadow-[0_0_30px_rgba(100,255,218,0.05)] p-10 md:p-16 text-center relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-cricket-gold/5 to-transparent pointer-events-none group-hover:from-cricket-gold/10 transition-colors duration-500"></div>
           <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-600 shadow-xl">
              <FiClock className="text-neon-blue text-4xl animate-pulse" />
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-wide">Next Prediction <span className="text-transparent bg-clip-text bg-gradient-to-r from-cricket-gold to-yellow-500">Coming Soon!</span></h2>
           <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Stay active and keep watching this space. Answer the next set of questions correctly and stand a chance to win exclusive <span className="text-white font-bold">Cash Prizes</span> & <span className="text-white font-bold">VIP Passes</span>!
           </p>
           <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 px-6 py-3 rounded-full text-sm font-bold text-slate-300 shadow-inner">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span> Live updates starting soon...
           </div>
        </div>
      </div>
    );
  }

  const parsedQuestions = typeof activePost.questions === 'string' ? JSON.parse(activePost.questions) : activePost.questions;
  const parsedPrizes = activePost.prizes ? (typeof activePost.prizes === 'string' ? JSON.parse(activePost.prizes) : activePost.prizes) : [];

  return (
    <div id="posts" className="max-w-4xl mx-auto px-4 my-10 pt-10">
      
      {/* POST CONTENT */}
      <div className="bg-[#0b1b36] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="h-56 md:h-72 relative w-full border-b border-neon-blue/30">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b36] via-[#0b1b36]/40 to-transparent z-10"></div>
            <img src={activePost.imagePath} alt={activePost.title} className="w-full h-full object-cover z-0" />
        </div>
        
        <div className="p-6 relative z-20 -mt-16">
          <span className="bg-cricket-gold text-cricket-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-lg">Live Prediction</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-md">{activePost.title}</h2>
          
          {/* Description එක මෙතන පෙන්නනවා */}
          {activePost.description && (
             <p className="text-slate-300 text-sm mb-6 bg-slate-800/80 p-4 rounded-xl border border-slate-600 shadow-inner whitespace-pre-line leading-relaxed">
                 {activePost.description}
             </p>
          )}

          {parsedPrizes.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-3">
                 {parsedPrizes.map((prize, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-yellow-500/10 to-cricket-gold/10 border border-cricket-gold/40 px-4 py-2 rounded-xl flex items-center gap-3">
                       <div className="bg-cricket-gold/20 p-2 rounded-full">
                           <FiAward className="text-cricket-gold" size={20}/>
                       </div>
                       <div>
                          <p className="text-[10px] text-yellow-500 uppercase font-black tracking-wide">{prize.title}</p>
                          <p className="text-white font-black text-lg">${prize.price}</p>
                       </div>
                    </div>
                 ))}
              </div>
          )}
          
          <ul className="space-y-3 text-slate-200 bg-black/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50">
            {parsedQuestions.map((question, index) => (
                <li key={index} className="flex gap-3 items-start">
                    <span className="bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded text-sm font-bold mt-0.5">Q{index + 1}</span> 
                    <span>{question.text || question}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ANSWER INPUTS */}
      <div className="mt-8 bg-[#0b1b36]/50 p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden">
        {hasCommented && (
            <div className="absolute inset-0 bg-[#0b1b36]/80 backdrop-blur-sm z-30 flex items-center justify-center">
                <div className="bg-green-500/20 text-green-400 border border-green-500/50 px-6 py-4 rounded-2xl font-bold flex flex-col items-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <FiAward size={30} className="mb-2" />
                    You have successfully submitted your predictions!
                </div>
            </div>
        )}

        <h3 className="text-lg font-bold text-white mb-4">Submit Your Predictions</h3>
        
        <div className="mb-6 relative">
            <label className="block text-xs text-slate-400 mb-1 ml-1">Your Display Name</label>
            <div className="relative w-full md:w-1/2">
               <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} disabled={hasSavedName} placeholder="e.g. Dilshan Silva" className={`w-full bg-[#020c1b] border border-slate-600 rounded-xl p-3 text-white focus:outline-none transition-all ${hasSavedName ? 'opacity-60 cursor-not-allowed' : 'focus:border-neon-blue'}`}/>
               {hasSavedName && <FiLock className="absolute right-3 top-3.5 text-slate-400" title="Name is locked" />}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {parsedQuestions.map((_, index) => (
                <div key={index}>
                    <label className="block text-xs text-slate-400 mb-1 ml-1">Answer {index + 1}</label>
                    <input type="text" value={answers[index] || ''} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder={`Your Answer`} className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue transition-all" />
                </div>
            ))}
        </div>
        <button onClick={submitComment} disabled={submitting} className="w-full md:w-auto md:px-10 bg-gradient-to-r from-neon-blue to-[#00b3cc] text-cricket-dark font-extrabold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] transition-all">
          {submitting ? 'Submitting...' : 'Post Answers'}
        </button>
      </div>

      {/* WINDOWED LIVE COMMENTS DISPLAY */}
      <div className="mt-10 bg-[#0b1b36]/80 p-4 md:p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
             <h3 className="text-xl font-bold text-white">Live Predictions</h3>
             <span className="bg-slate-800 text-neon-blue px-3 py-1 rounded-full text-xs font-bold">{comments.length} Comments</span>
          </div>
          
          <div className="h-[450px] overflow-y-auto pr-1 md:pr-3 space-y-4 custom-scrollbar">
              {comments.length > 0 ? comments.map((comment, index) => {
                  const isFirstComment = index === 0; 
                  const reacts = comment.reactions || {}; 
                  
                  return (
                  <div key={comment.id} className={`flex flex-col gap-2 p-4 md:p-5 rounded-2xl border transition-all ${
                      comment.is_winner ? 'bg-cricket-gold/10 border-cricket-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 
                      comment.is_vip ? 'bg-gradient-to-r from-[#1a1500] to-[#0b1b36] border-l-4 border-l-cricket-gold border-y-slate-800 border-r-slate-800' : 
                      isFirstComment ? 'bg-emerald-900/10 border-emerald-500/50' : 'bg-[#020c1b] border-slate-800'
                  }`}>
                      <div className="flex gap-3 md:gap-4">
                        <div className="relative shrink-0">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-lg ${comment.is_vip ? 'bg-gradient-to-br from-cricket-gold to-yellow-600 text-black' : isFirstComment ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                                {comment.avatar}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                                <span className={`font-bold text-sm md:text-base truncate max-w-full ${comment.is_vip ? 'text-cricket-gold drop-shadow-md' : isFirstComment ? 'text-emerald-400' : 'text-white'}`}>
                                    {comment.name}
                                </span>
                                {isFirstComment && <span className="bg-emerald-500 text-white text-[9px] md:text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">First 🔥</span>}
                                {comment.is_vip && <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase flex items-center gap-1"><FiStar/> VIP</span>}
                                {comment.is_winner && <span className="bg-cricket-gold text-cricket-dark text-[9px] md:text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><FiAward/> Winner</span>}
                            </div>
                            <p className={`text-xs md:text-sm whitespace-pre-line ${comment.is_vip ? 'text-slate-200' : 'text-slate-400'}`}>{comment.text}</p>
                            
                            {/* Reactions Buttons */}
                            <div className="flex items-center gap-4 mt-3">
                               <button onClick={() => handleReact(comment.id, 'like')} className="flex items-center gap-1.5 text-slate-500 hover:text-neon-blue transition text-xs font-bold bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700 hover:border-neon-blue/50">
                                  <FiThumbsUp size={14}/> {reacts.like || 0}
                               </button>
                               <button onClick={() => handleReact(comment.id, 'love')} className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition text-xs font-bold bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700 hover:border-pink-500/50">
                                  <FiHeart size={14}/> {reacts.love || 0}
                               </button>
                            </div>
                        </div>
                      </div>

                      {/* Admin Reply Highlight */}
                      {comment.admin_reply && (
                          <div className="mt-2 ml-12 md:ml-16 bg-gradient-to-r from-cricket-gold/10 to-transparent border-l-[3px] border-cricket-gold p-2 md:p-3 rounded-r-lg">
                              <div className="flex items-center gap-1.5 mb-1">
                                  <FaCrown className="text-cricket-gold" size={12}/>
                                  <span className="text-cricket-gold text-[10px] md:text-xs font-black uppercase tracking-wider">Admin Reply</span>
                              </div>
                              <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">{comment.admin_reply}</p>
                          </div>
                      )}

                  </div>
              )}) : (
                <div className="text-center py-10 text-slate-500 italic text-sm">No predictions yet. Be the first!</div>
              )}
          </div>
      </div>
    </div>
  );
};

export default PostSection;