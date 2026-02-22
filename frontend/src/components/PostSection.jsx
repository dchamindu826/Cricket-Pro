import React, { useState, useEffect } from 'react';
import { FiAward } from 'react-icons/fi';

const PostSection = () => {
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [answers, setAnswers] = useState({});
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPostAndComments = async () => {
    try {
      const postRes = await fetch('http://localhost:5000/api/posts');
      const postData = await postRes.json();
      
      if (postData.length > 0) {
          const currentPost = postData[0];
          setActivePost(currentPost);

          const commentRes = await fetch(`http://localhost:5000/api/comments/post/${currentPost.id}`);
          const commentData = await commentRes.json();
          setComments(commentData);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, []);

  const handleAnswerChange = (index, value) => {
      setAnswers(prev => ({...prev, [index]: value}));
  };

  const submitComment = async () => {
      if (!activePost) return;
      
      if (!guestName.trim()) return alert("Please enter your name!");
      if (Object.keys(answers).length < activePost.questions.length) {
          return alert("Please answer all questions before submitting.");
      }

      setSubmitting(true);

      let deviceId = localStorage.getItem('cric_device_id');
      if (!deviceId) {
          deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('cric_device_id', deviceId);
      }

      const isVipUser = localStorage.getItem('is_vip') === 'true';

      const formattedAnswers = activePost.questions.map((_, i) => `${i + 1}. ${answers[i] || ''}`).join(' | ');

      const commentData = {
          post_id: activePost.id,
          name: guestName,
          avatar: guestName.charAt(0).toUpperCase(),
          text: formattedAnswers,
          device_id: deviceId,
          is_vip: isVipUser
      };

      try {
          const response = await fetch('http://localhost:5000/api/comments/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(commentData)
          });
          
          const result = await response.json();
          if (result.success) {
              alert(result.message);
              fetchPostAndComments();
              setAnswers({});
              localStorage.setItem('saved_guest_name', guestName);
          } else {
              alert(result.message);
          }
      } catch (error) {
          alert("Error submitting predictions.");
      } finally {
          setSubmitting(false);
      }
  };

  useEffect(() => {
      const savedName = localStorage.getItem('saved_guest_name');
      if(savedName) setGuestName(savedName);
  }, []);

  if (loading) return <div id="live-match" className="text-center text-neon-blue py-20 font-bold animate-pulse">Loading Live Prediction...</div>;
  if (!activePost) return <div id="live-match" className="text-center text-slate-500 py-20">No active predictions at the moment.</div>;

  return (
    <div id="posts" className="max-w-4xl mx-auto px-4 my-10 pt-10">
      
      {/* POST CONTENT */}
      <div id="live-match" className="bg-[#0b1b36] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="h-56 md:h-72 relative w-full border-b border-neon-blue/30">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b36] via-[#0b1b36]/40 to-transparent z-10"></div>
            <img src={activePost.imagePath} alt={activePost.title} className="w-full h-full object-cover z-0" />
        </div>
        
        <div className="p-6 relative z-20 -mt-16">
          <span className="bg-cricket-gold text-cricket-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-lg">Live Prediction</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-md">{activePost.title}</h2>
          
          <ul className="space-y-3 text-slate-200 bg-black/40 backdrop-blur-sm p-5 rounded-xl border border-slate-600/50">
            {activePost.questions.map((question, index) => (
                <li key={index} className="flex gap-3 items-start">
                    <span className="bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded text-sm font-bold">Q{index + 1}</span> 
                    <span>{question}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ANSWER INPUTS */}
      <div className="mt-8 bg-[#0b1b36]/50 p-6 rounded-2xl border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">Submit Your Predictions</h3>
        
        <div className="mb-6">
            <label className="block text-xs text-slate-400 mb-1 ml-1">Your Display Name</label>
            <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Dilshan Silva" 
                className="w-full md:w-1/2 bg-[#020c1b] border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue transition-all"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {activePost.questions.map((_, index) => (
                <div key={index}>
                    <label className="block text-xs text-slate-400 mb-1 ml-1">Answer {index + 1}</label>
                    <input 
                        type="text" 
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Your Answer for Q${index + 1}`} 
                        className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                    />
                </div>
            ))}
        </div>
        <button onClick={submitComment} disabled={submitting} className="w-full md:w-auto md:px-10 bg-gradient-to-r from-neon-blue to-[#00b3cc] text-cricket-dark font-extrabold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] transition-all">
          {submitting ? 'Submitting...' : 'Post Answers'}
        </button>
      </div>

      {/* LIVE COMMENTS DISPLAY */}
      <div className="mt-10">
          <h3 className="text-xl font-bold border-b border-slate-700 pb-3 mb-4 text-white">Predictions ({comments.length})</h3>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {comments.map((comment, index) => {
                  const isFirstComment = index === comments.length - 1; 
                  
                  return (
                  <div key={comment.id} className={`flex gap-4 p-5 rounded-2xl border transition-all ${
                      comment.is_winner 
                        ? 'bg-cricket-gold/10 border-cricket-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                        : comment.is_vip 
                          ? 'bg-gradient-to-r from-[#1a1500] to-[#0b1b36] border-l-4 border-l-cricket-gold border-y-slate-800 border-r-slate-800 shadow-[0_5px_15px_rgba(255,215,0,0.05)]' 
                          : isFirstComment 
                            ? 'bg-emerald-900/10 border-emerald-500/30' 
                            : 'bg-[#0b1b36] border-slate-800'
                  }`}>
                      <div className="relative shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                              comment.is_vip ? 'bg-gradient-to-br from-cricket-gold to-yellow-600 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 
                              isFirstComment ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                          }`}>
                              {comment.avatar}
                          </div>
                          {comment.is_vip && <span className="absolute -bottom-2 -right-2 bg-black text-cricket-gold text-[10px] border border-cricket-gold px-1.5 rounded-full font-black z-10">★</span>}
                      </div>
                      
                      <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`font-bold text-base ${comment.is_vip ? 'text-cricket-gold drop-shadow-md' : isFirstComment ? 'text-emerald-400' : 'text-white'}`}>
                                  {comment.name}
                              </span>
                              
                              {comment.is_vip && <span className="bg-gradient-to-r from-cricket-gold to-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">Premium VIP</span>}
                              {isFirstComment && <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">First Blood</span>}
                              {comment.is_winner && <span className="bg-cricket-gold text-cricket-dark text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><FiAward/> Winner</span>}
                          </div>
                          <p className={`text-sm whitespace-pre-line ${comment.is_vip ? 'text-slate-200' : 'text-slate-400'}`}>{comment.text}</p>
                      </div>
                  </div>
              )})}
          </div>
      </div>
    </div>
  );
};

export default PostSection;