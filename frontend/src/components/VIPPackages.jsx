import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { FiCheckCircle, FiCopy, FiUploadCloud } from 'react-icons/fi';

const VIPPackages = () => {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [copiedText, setCopiedText] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Aluth states deka preview ekata
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/packages');
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages", error);
      }
    };
    fetchPackages();

    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleCheckoutClick = async (pkg) => {
    if (!user) {
        try {
            await signInWithPopup(auth, provider);
            setSelectedPackage(pkg);
        } catch (error) {
            console.error("Login failed", error);
        }
    } else {
        setSelectedPackage(pkg);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert("Please select an image first.");
    setUploading(true);

    const formData = new FormData();
    formData.append('slipImage', selectedFile);
    formData.append('userName', user.displayName);
    formData.append('userEmail', user.email);
    formData.append('packageName', selectedPackage.name);

    try {
        const response = await fetch('http://localhost:5000/api/orders/create', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            setSelectedPackage(null); 
            setSelectedFile(null);
            setPreviewUrl('');
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Error uploading slip.");
    } finally {
        setUploading(false);
    }
  };

  const CopyItem = ({ label, value }) => (
    <div className="flex justify-between items-center bg-[#020c1b] p-3 rounded-lg border border-slate-700 mb-2">
        <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-bold text-white">{value}</p></div>
        <button onClick={() => copyToClipboard(value)} className="text-slate-400 hover:text-neon-blue"><FiCopy /></button>
    </div>
  );

  return (
    <div id="vip-packages" className="max-w-6xl mx-auto px-4 my-20 pt-10">
      <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cricket-gold to-yellow-500 mb-4 drop-shadow-lg">Premium VIP Access</h2>
      </div>

      {!selectedPackage ? (
          // flex flex-wrap justify-center damma balance wenna
          <div className="flex flex-wrap justify-center gap-6">
              {packages.map((pkg) => (
                  <div key={pkg.id} className="w-full max-w-[350px] bg-[#0b1b36] p-8 rounded-3xl border border-cricket-gold/50 shadow-xl relative overflow-hidden group">
                      <h3 className="text-2xl font-bold text-cricket-gold mb-2">{pkg.name}</h3>
                      <div className="text-4xl font-black text-white mb-6">{pkg.price}<span className="text-lg text-slate-400 font-normal"> /mo</span></div>
                      <ul className="space-y-3 text-sm text-slate-300 mb-8 flex-1">
                          {pkg.features.map((f, i) => <li key={i}>✨ {f}</li>)}
                      </ul>
                      <button onClick={() => handleCheckoutClick(pkg)} className="w-full bg-cricket-gold text-cricket-dark font-black py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition">
                          Checkout Now
                      </button>
                  </div>
              ))}
          </div>
      ) : (
          <div className="bg-[#0b1b36] p-6 md:p-8 rounded-3xl border border-neon-blue/50 max-w-2xl mx-auto shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-700 pb-4">Checkout: {selectedPackage.name} ({selectedPackage.price})</h3>
              <p className="text-sm text-slate-400 mb-6">Logged in as: <span className="text-white font-bold">{user.email}</span></p>
              
              <div className="space-y-6">
                  <div>
                      <h4 className="text-neon-blue font-bold mb-3">🏦 Bank Transfer Details</h4>
                      <CopyItem label="Bank Name" value="Commercial Bank" />
                      <CopyItem label="Account Name" value="Cricket Pro" />
                      <CopyItem label="Account Number" value="1000 2345 6789" />
                  </div>
                  <div>
                      <h4 className="text-yellow-500 font-bold mb-3">🪙 Crypto Payment (USDT TRC20)</h4>
                      <CopyItem label="Wallet Address" value="TXaK7bR..." />
                  </div>
                  
                  {/* Image Preview and Upload Logic */}
                  <div className="bg-[#050f20] p-6 rounded-xl border border-slate-700 border-dashed text-center">
                      <h4 className="text-white font-bold mb-2">Upload Payment Slip</h4>
                      
                      {previewUrl ? (
                          <div className="mb-4">
                              <img src={previewUrl} alt="Preview" className="w-48 h-auto max-h-48 object-contain rounded-lg border border-neon-blue mx-auto shadow-lg" />
                              <button onClick={() => {setSelectedFile(null); setPreviewUrl('');}} className="mt-2 text-red-400 text-xs font-bold underline">Remove Image</button>
                          </div>
                      ) : (
                          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 mb-4 max-w-xs mx-auto transition">
                              <FiUploadCloud /> Choose Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={uploading}/>
                          </label>
                      )}

                      <button 
                          onClick={handleFileUpload} 
                          disabled={!selectedFile || uploading}
                          className={`w-full max-w-xs font-black py-3 rounded-xl transition-all mx-auto block ${
                              (!selectedFile || uploading) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-neon-blue to-[#00b3cc] text-[#020c1b] hover:shadow-[0_0_20px_rgba(100,255,218,0.4)]'
                          }`}
                      >
                          {uploading ? 'Uploading...' : 'Upload & Submit Order'}
                      </button>
                  </div>
              </div>
              <button onClick={() => setSelectedPackage(null)} className="mt-6 text-slate-400 hover:text-white text-sm font-bold underline block mx-auto">Cancel & Go Back</button>
          </div>
      )}
    </div>
  );
};

export default VIPPackages;