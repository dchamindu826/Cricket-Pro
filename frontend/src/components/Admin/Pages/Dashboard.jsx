import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiUsers, FiMessageSquare, FiEdit2, FiTrash2, FiMonitor, FiAward, FiCheck, FiActivity, FiSave } from 'react-icons/fi';

const Dashboard = () => {
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [savingWinners, setSavingWinners] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit States
  const [editTitle, setEditTitle] = useState('');
  const [editQuestions, setEditQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch('http://localhost:5000/api/posts');
        const postData = await postRes.json();
        
        if (postData.length > 0) {
            setActivePost(postData[0]);
            setEditTitle(postData[0].title);
            setEditQuestions(postData[0].questions);
            
            const commentRes = await fetch(`http://localhost:5000/api/comments/post/${postData[0].id}`);
            const commentData = await commentRes.json();
            setComments(commentData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const toggleWinner = (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, is_winner: !c.is_winner } : c));
  };

  const saveWinnersToDB = async () => {
    setSavingWinners(true);
    const winnerIds = comments.filter(c => c.is_winner).map(c => c.id);

    try {
      const response = await fetch('http://localhost:5000/api/comments/update-winners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winnerIds })
      });
      const data = await response.json();
      if(data.success) {
          alert("Winners saved successfully! They are now in the Winners Workflow.");
      }
    } catch (error) {
      alert("Error saving winners.");
    } finally {
      setSavingWinners(false);
    }
  };

  // Mock Handle Update Post (Backend needs an update route for this to fully work)
  const handleUpdatePost = async () => {
      try {
          const response = await fetch(`http://localhost:5000/api/posts/update/${activePost.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: editTitle, questions: editQuestions })
          });
          const data = await response.json();
          if(data.success) {
              alert("Post details updated successfully!");
              setActivePost({...activePost, title: editTitle, questions: editQuestions});
              setIsEditing(false);
          }
      } catch (error) {
          alert("Error updating post");
      }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-200">
      
      {/* 1. Stats Row (Updated as requested) */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
              <p className="text-slate-400 text-xs font-bold mb-2 flex items-center gap-1"><FiActivity className="text-emerald-400"/> Live Reach</p>
              <h3 className="text-2xl font-black text-white">1,432</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
              <p className="text-slate-400 text-xs font-bold mb-2 flex items-center gap-1"><FiUsers className="text-blue-400"/> Active VIPs</p>
              <h3 className="text-2xl font-black text-white">348</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
              <p className="text-slate-400 text-xs font-bold mb-2 text-yellow-500">Pending VIP Req</p>
              <h3 className="text-2xl font-black text-white">5</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
              <p className="text-slate-400 text-xs font-bold mb-2 text-green-400">VIP Revenue</p>
              <h3 className="text-xl font-black text-white">Rs. 45,500</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Stream Config */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-3 flex items-center gap-2"><span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>Update Live Stream</h3>
             <form className="space-y-4 flex-1">
                 <div><input type="text" placeholder="Match Title" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" /></div>
                 <div><input type="text" placeholder="Iframe URL" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" /></div>
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-4"><FiMonitor /> Publish Stream</button>
             </form>
          </div>

          {/* Active Post Details & Editor */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
             <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                 <h3 className="text-lg font-bold text-white">Current Active Post</h3>
                 <div className="flex gap-2">
                     <button onClick={() => setIsEditing(!isEditing)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition"><FiEdit2 size={16}/></button>
                 </div>
             </div>
             
             {activePost ? (
                 <div className="flex-1">
                     {!isEditing ? (
                         <>
                            <h2 className="text-xl font-bold text-white mb-2">{activePost.title}</h2>
                            <img src={activePost.imagePath} alt="banner" className="w-full h-24 object-cover rounded-lg mb-4 border border-slate-700" />
                            <div className="space-y-2 text-sm text-slate-300 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                {activePost.questions.map((q, i) => (
                                    <p key={i}><span className="text-blue-400 font-bold mr-2">Q{i+1}:</span>{q}</p>
                                ))}
                            </div>
                         </>
                     ) : (
                         <div className="space-y-3">
                             <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                             {editQuestions.map((q, i) => (
                                 <input key={i} type="text" value={q} onChange={(e) => {
                                     const newQ = [...editQuestions];
                                     newQ[i] = e.target.value;
                                     setEditQuestions(newQ);
                                 }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                             ))}
                             <button onClick={handleUpdatePost} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2"><FiSave /> Save Changes</button>
                         </div>
                     )}
                 </div>
             ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-500">No active post found.</div>
             )}
          </div>
      </div>

      {/* 3. Live Comments & Winner Selection */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-[600px]">
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-xl z-10">
            <div>
                <h3 className="font-bold text-lg text-white">Live Predictions</h3>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-bold flex items-center gap-2">
                Total: <span className="text-blue-400">{comments.length}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900/50">
            {comments.map((comment, index) => {
                const isFirstComment = index === comments.length - 1;

                return (
                <div key={comment.id} className={`flex gap-4 p-4 rounded-lg border ${comment.is_winner ? 'bg-yellow-500/10 border-yellow-500/50' : comment.is_vip ? 'bg-blue-900/20 border-blue-500/50' : isFirstComment ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-600 text-white">{comment.avatar}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-white">{comment.name}</span>
                            {comment.is_vip && <span className="bg-blue-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">VIP</span>}
                            {isFirstComment && <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">First Blood</span>}
                        </div>
                        <p className="text-slate-300 text-sm mb-4 bg-slate-900 p-3 rounded-md border border-slate-700 inline-block">
                            {comment.text}
                        </p>
                        <div>
                            <button 
                                onClick={() => toggleWinner(comment.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${comment.is_winner ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                            >
                                {comment.is_winner ? <><FiCheck /> Marked as Winner</> : <><FiAward /> Mark Winner</>}
                            </button>
                        </div>
                    </div>
                </div>
            )})}
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-xl">
            <button onClick={saveWinnersToDB} disabled={savingWinners} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                {savingWinners ? 'Saving...' : 'Save Selected Winners & Send to Workflow'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;