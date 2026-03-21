import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { FiCheckCircle, FiCopy, FiUploadCloud, FiCheck, FiStar, FiShield, FiZap, FiX } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const VIPPackages = () => {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [copiedText, setCopiedText] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState('');

  const [isVip, setIsVip] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const checkVipStatus = () => {
        if (user) {
            const vipStatus = localStorage.getItem(`is_vip_${user.uid}`) === 'true';
            const expiry = localStorage.getItem(`vip_expiry_${user.uid}`);
            
            if (vipStatus && expiry) {
                if (new Date(expiry) > new Date()) {
                    setIsVip(true);
                    setExpiryDate(new Date(expiry).toLocaleDateString());
                } else {
                    localStorage.setItem(`is_vip_${user.uid}`, 'false');
                    localStorage.removeItem(`vip_expiry_${user.uid}`);
                    setIsVip(false);
                }
            } else { setIsVip(false); }
        } else { setIsVip(false); }
    };
    checkVipStatus();
  }, [user]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('https://cricket-pro-three.vercel.app/api/packages');
        const data = await res.json();
        if (Array.isArray(data)) setPackages(data);
      } catch (error) { console.error(error); }
    };
    fetchPackages();
    
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔴 Firebase අවුල හදපු තැන
  const handleCheckoutClick = (e, pkg) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ලොග් වෙලා නැත්නම් Mobile වල Popup හිරවෙන නිසා, කෙලින්ම Alert එකක් දෙනවා
    if (!user) {
        alert("Please login first using the Login button at the top menu!");
        return; 
    } 
    
    // ලොග් වෙලා නම් Modal එක ඕපන් කරනවා
    setSelectedPackage(pkg);
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
        const response = await fetch('https://cricket-pro-three.vercel.app/api/orders/create', {
            method: 'POST', body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            setSelectedPackage(null); 
            setSelectedFile(null);
            setPreviewUrl('');
            
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1); 
            localStorage.setItem(`is_vip_${user.uid}`, 'true');
            localStorage.setItem(`vip_expiry_${user.uid}`, nextMonth.toISOString());
            window.dispatchEvent(new CustomEvent('vipActivated', { detail: { uid: user.uid } }));
        } else { alert("Error: " + data.message); }
    } catch (error) {
        alert("Error uploading slip.");
    } finally { setUploading(false); }
  };

  const CopyItem = ({ label, value }) => (
    <div className="flex justify-between items-center bg-[#020c1b] p-3 rounded-lg border border-slate-700 mb-2">
        <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-bold text-white">{value}</p></div>
        <button onClick={() => copyToClipboard(value)} className="text-slate-400 hover:text-neon-blue cursor-pointer"><FiCopy /></button>
    </div>
  );

  return (
    <div id="vip-packages" className="max-w-7xl mx-auto px-4 my-24 relative z-20">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] mb-4 uppercase tracking-wider">
            Choose Your Pass
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Join the VIP club to increase your winning chances and get exclusive perks.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${packages && packages.length > 0 ? 'lg:grid-cols-3' : ''} gap-8 max-w-6xl mx-auto`}>
          <div className="bg-[#0b1b36] border border-slate-700 rounded-3xl p-8 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><FiShield className="text-slate-400" /> Standard</h3>
              <div className="text-4xl font-black text-white mt-4">Free</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><FiCheck className="text-neon-blue mt-1"/> <span className="text-slate-300">Watch live streams</span></li>
              <li className="flex items-start gap-3"><FiCheck className="text-neon-blue mt-1"/> <span className="text-slate-300">Live predictions</span></li>
            </ul>
            <div className="w-full mt-auto pt-4">
                <button disabled className="w-full bg-slate-800 text-slate-400 font-bold py-4 rounded-xl cursor-not-allowed">Current Plan</button>
            </div>
          </div>

          {Array.isArray(packages) && packages.length > 0 && packages.map((pkg, index) => (
              <div key={pkg.id || index} className="bg-gradient-to-b from-[#1a1500] to-[#0b1b36] border-2 border-cricket-gold rounded-3xl p-8 flex flex-col shadow-lg relative h-full">
                {index === 0 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-cricket-gold text-black px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                      <FaCrown size={16} /> Most Popular
                    </div>
                )}
                <div className="mb-8 mt-2">
                  <h3 className="text-2xl font-bold text-cricket-gold mb-2 flex items-center gap-2"><FiStar className="text-yellow-500" /> {pkg.name}</h3>
                  <div className="text-4xl font-black text-white mt-4">$ {pkg.price}</div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FiCheck className="text-cricket-gold mt-1"/> <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="w-full mt-auto pt-4">
                    {isVip ? (
                      <button disabled className="w-full bg-green-500/20 text-green-500 font-bold py-4 rounded-xl cursor-not-allowed flex justify-center gap-2"><FiCheckCircle size={20}/> Active Membership</button>
                    ) : (
                      <button onClick={(e) => handleCheckoutClick(e, pkg)} className="w-full bg-gradient-to-r from-cricket-gold to-yellow-600 text-black font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <FiZap size={20} /> Subscribe Now
                      </button>
                    )}
                </div>
              </div>
          ))}
      </div>

      {/* 🔴 100% Bulletproof Mobile Safe Modal 🔴 */}
      {selectedPackage && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              
              {/* Black Background */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', cursor: 'pointer' }} onClick={() => setSelectedPackage(null)}></div>
              
              {/* Form Content */}
              <div style={{ backgroundColor: '#0b1b36', padding: '24px', borderRadius: '24px', width: '100%', maxWidth: '600px', position: 'relative', zIndex: 10, maxHeight: '85vh', overflowY: 'auto', border: '1px solid #00b3cc' }}>
                  
                  <button onClick={() => setSelectedPackage(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-2 cursor-pointer">
                      <FiX size={20}/>
                  </button>
                  
                  <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-700 pb-4 pr-8">Checkout: {selectedPackage.name} (${selectedPackage.price})</h3>
                  <p className="text-sm text-slate-400 mb-6">Logged in as: <span className="text-white font-bold">{user?.email}</span></p>
                  
                  <div className="space-y-6">
                      <div>
                          <h4 className="text-neon-blue font-bold mb-3">🏦 Bank Transfer Details</h4>
                          <CopyItem label="Bank Name" value="Commercial Bank" />
                          <CopyItem label="Account Name" value="Cricket Pro" />
                          <CopyItem label="Account Number" value="1000 2345 6789" />
                      </div>
                      
                      <div className="bg-[#050f20] p-5 rounded-xl border border-slate-700 border-dashed text-center">
                          <h4 className="text-white font-bold mb-3">Upload Payment Slip</h4>
                          
                          {previewUrl ? (
                              <div className="mb-4">
                                  <img src={previewUrl} alt="Preview" className="w-full max-h-40 object-contain rounded-lg border border-neon-blue mx-auto" />
                                  <button onClick={() => { setSelectedFile(null); setPreviewUrl('');}} className="mt-3 text-red-400 text-xs font-bold underline px-4 py-2 cursor-pointer">Remove Image</button>
                              </div>
                          ) : (
                              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 mb-4 mx-auto transition">
                                  <FiUploadCloud /> Choose Image
                                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={uploading}/>
                              </label>
                          )}

                          <button 
                              onClick={handleFileUpload} 
                              disabled={!selectedFile || uploading}
                              className={`w-full font-black py-4 rounded-xl transition-all mx-auto block mt-2 cursor-pointer ${
                                  (!selectedFile || uploading) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-neon-blue to-[#00b3cc] text-[#020c1b] shadow-lg'
                              }`}
                          >
                              {uploading ? 'Uploading...' : 'Submit Order'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default VIPPackages;