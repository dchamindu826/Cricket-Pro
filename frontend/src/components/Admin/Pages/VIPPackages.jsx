import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';

const VIPPackages = () => {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Packages from DB
  const fetchPackages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add single feature to the list before submitting
  const handleAddFeature = (e) => {
    e.preventDefault();
    if (featureInput.trim()) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (featuresList.length === 0) return alert("Please add at least one feature!");
    
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/packages/create', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, features: featuresList })
      });
      const data = await res.json();
      
      if(data.success) {
        alert("Package Created Successfully!");
        fetchPackages(); // Refresh list
        setName(''); setPrice(''); setFeaturesList([]);
      }
    } catch (error) {
      alert("Error creating package");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
     if(!window.confirm("Are you sure you want to delete this package?")) return;
     try {
       const res = await fetch(`http://localhost:5000/api/packages/${id}`, { method: 'DELETE' });
       const data = await res.json();
       if(data.success) {
         setPackages(packages.filter(p => p.id !== id));
       }
     } catch (error) {
       alert("Error deleting package");
     }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-200">
      <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-wide">Manage VIP Packages</h1>
          <p className="text-slate-400 text-sm">Create and list dynamic premium VIP packages for your site.</p>
      </div>

      <div className="bg-[#0b1b36] p-8 rounded-2xl border border-slate-700/50 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-cricket-gold">✦</span> Create New Package
          </h3>
          <form onSubmit={handleCreatePackage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-slate-400 text-sm font-bold mb-2">Package Name</label>
                      <input type="text" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Premium Fan" className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors" />
                  </div>
                  <div>
                      <label className="block text-slate-400 text-sm font-bold mb-2">Price Label</label>
                      <input type="text" required value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="e.g. Rs. 990 /mo" className="w-full bg-[#020c1b] border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors" />
                  </div>
              </div>
              
              <div className="border-t border-slate-700 pt-6">
                  <label className="block text-slate-400 text-sm font-bold mb-2">Included Features</label>
                  <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={featureInput} 
                        onChange={(e)=>setFeatureInput(e.target.value)} 
                        placeholder="e.g. Priority Support" 
                        className="flex-1 bg-[#020c1b] border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" 
                        onKeyDown={(e) => e.key === 'Enter' && handleAddFeature(e)}
                      />
                      <button type="button" onClick={handleAddFeature} className="bg-slate-700 hover:bg-slate-600 text-white px-6 rounded-xl font-bold transition-colors">Add</button>
                  </div>
                  
                  {/* Feature List Preview */}
                  <ul className="space-y-2 mb-6">
                      {featuresList.map((f, i) => (
                          <li key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                              <span className="flex items-center gap-2 text-sm text-slate-300"><FiCheckCircle className="text-emerald-500" /> {f}</span>
                              <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-400 hover:text-red-500"><FiTrash2 size={14}/></button>
                          </li>
                      ))}
                  </ul>
              </div>

              <button type="submit" disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-neon-blue to-[#00b3cc] hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] text-[#020c1b] font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
                <FiSave /> {loading ? 'Saving Package...' : 'Publish VIP Package'}
              </button>
          </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
              <div key={pkg.id} className="bg-gradient-to-b from-[#0b1b36] to-[#071327] p-8 rounded-3xl border border-cricket-gold/30 relative group shadow-lg hover:shadow-[0_10px_30px_rgba(255,215,0,0.1)] transition-all">
                  <button onClick={() => handleDelete(pkg.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><FiTrash2 /></button>
                  <h3 className="text-2xl font-bold text-cricket-gold mb-1">{pkg.name}</h3>
                  <div className="text-3xl font-black text-white mb-6 border-b border-slate-700 pb-4">{pkg.price}</div>
                  <ul className="text-sm text-slate-300 space-y-3">
                      {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                              <FiCheckCircle className="text-emerald-500 mt-1 shrink-0" /> 
                              <span>{f}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          ))}
      </div>
    </div>
  );
};

export default VIPPackages;