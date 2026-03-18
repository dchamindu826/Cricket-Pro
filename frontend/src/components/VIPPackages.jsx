import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
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

  // VIP States
  const [isVip, setIsVip] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  // 1. Check VIP Status based on Logged-in User
  useEffect(() => {
    const checkVipStatus = () => {
        if (user) {
            // User ge ID ekata adala VIP data gannawa
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
            } else {
                setIsVip(false); // User ta nattam false
            }
        } else {
            setIsVip(false); // Login wela nattam false
        }
    };

    checkVipStatus();
  }, [user]); // user state eka wenas weddi meka run wenawa

  // 2. Fetch Packages and listen to Auth state
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('https://cricket-pro-three.vercel.app/api/packages');
        const data = await res.json();
        // Backend එකෙන් array එකක් ආවොත් විතරක් set කරනවා, නැත්නම් හිස් array එකක් දානවා (Crash වෙන එක නවත්වන්න)
        if (Array.isArray(data)) {
            setPackages(data);
        } else {
            setPackages([]);
        }
      } catch (error) {
        console.error("Error fetching packages", error);
        setPackages([]);
      }
    };
    fetchPackages();

    const unsubscribe = auth.onAuthStateChanged((u) => {
        setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckoutClick = async (pkg) => {
    if (!user) {
        try {
            await signInWithPopup(auth, provider);
            // Login unata passe auth.onAuthStateChanged eken user wa set wenawa
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
        const response = await fetch('https://cricket-pro-three.vercel.app/api/orders/create', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            setSelectedPackage(null); 
            setSelectedFile(null);
            setPreviewUrl('');
            
            // Note: Eththatama nam meka admin approve kalama wenne.
            // Danata order eka dapu gaman test karanna active karanawa
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1); 
localStorage.setItem(`is_vip_${user.uid}`, 'true');
localStorage.setItem(`vip_expiry_${user.uid}`, nextMonth.toISOString());

window.dispatchEvent(new CustomEvent('vipActivated', { detail: { uid: user.uid } }));
            
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

  const FeatureList = ({ features, isGold }) => (
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div className={`mt-1 p-1 rounded-full shrink-0 ${isGold ? 'bg-cricket-gold/20 text-cricket-gold' : 'bg-slate-700 text-neon-blue'}`}>
             <FiCheck size={14} className="font-bold" />
          </div>
          <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div id="vip-packages" className="max-w-7xl mx-auto px-4 my-24 relative z-20">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] mb-4 uppercase tracking-wider">
            Choose Your Pass
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Join the VIP club to increase your winning chances and get exclusive perks.</p>
      </div>

      {!selectedPackage ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${packages && packages.length > 0 ? 'lg:grid-cols-3' : ''} gap-8 items-stretch max-w-6xl mx-auto`}>
              
              {/* ================= FREE PACKAGE ================= */}
              <div className="bg-[#0b1b36] border border-slate-700 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-all duration-300 h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                     <FiShield className="text-slate-400" /> Standard User
                  </h3>
                  <div className="text-4xl font-black text-white mt-4">Free</div>
                  <p className="text-slate-500 text-sm mt-2">Always free for everyone</p>
                </div>
                
                <FeatureList 
                   isGold={false}
                   features={[
                      "Watch live cricket streams",
                      "Participate in live predictions",
                      "Standard display name in comments",
                      "Eligible for basic rewards"
                   ]} 
                />
                
                <div className="w-full mt-auto pt-4">
                    <button disabled className="w-full bg-slate-800 text-slate-400 font-bold py-4 rounded-xl cursor-not-allowed">
                      Current Plan
                    </button>
                </div>
              </div>

              {/* ================= DYNAMIC VIP PACKAGES ================= */}
              {Array.isArray(packages) && packages.length > 0 && packages.map((pkg, index) => (
                  <div key={pkg.id || index} className="bg-gradient-to-b from-[#1a1500] to-[#0b1b36] border-2 border-cricket-gold rounded-3xl p-8 flex flex-col shadow-[0_20px_50px_rgba(255,215,0,0.15)] relative h-full">
                    
                    {index === 0 && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-cricket-gold text-black px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                          <FaCrown size={16} /> Most Popular
                        </div>
                    )}

                    <div className="mb-8 mt-2">
                      <h3 className="text-2xl font-bold text-cricket-gold mb-2 flex items-center gap-2">
                         <FiStar className="text-yellow-500 fill-current" /> {pkg.name}
                      </h3>
                      <div className="text-4xl lg:text-5xl font-black text-white drop-shadow-md mt-4">
                     $ {pkg.price}
                     </div>
                      <p className="text-yellow-500/80 text-sm mt-2 font-semibold">Cancel anytime</p>
                    </div>
                    
                    <FeatureList 
                       isGold={true}
                       features={pkg.features || []} 
                    />
                    
                    <div className="w-full mt-auto pt-4">
                        {isVip ? (
                          <div>
                              <button disabled className="w-full bg-green-500/20 text-green-500 border border-green-500/50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                  <FiCheckCircle size={20} /> Active Membership
                              </button>
                              <p className="text-center text-xs text-slate-400 mt-3">Valid until: {expiryDate}</p>
                          </div>
                        ) : (
                          <button 
                              onClick={() => handleCheckoutClick(pkg)}
                              className="w-full bg-gradient-to-r from-cricket-gold to-yellow-600 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                          >
                              <FiZap size={20} /> Subscribe Now
                          </button>
                        )}
                    </div>
                  </div>
              ))}
          </div>
      ) : (
          /* ================= PAYMENT MODAL / SECTION ================= */
          <div className="bg-[#0b1b36] p-6 md:p-8 rounded-3xl border border-neon-blue/50 max-w-2xl mx-auto shadow-2xl relative">
              <button onClick={() => setSelectedPackage(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-2">
                  <FiX size={20}/>
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-700 pb-4 pr-8">Checkout: {selectedPackage.name} ({selectedPackage.price})</h3>
              <p className="text-sm text-slate-400 mb-6">Logged in as: <span className="text-white font-bold">{user?.email}</span></p>
              
              <div className="space-y-6">
                  <div>
                      <h4 className="text-neon-blue font-bold mb-3">🏦 Bank Transfer Details</h4>
                      <CopyItem label="Bank Name" value="Commercial Bank" />
                      <CopyItem label="Account Name" value="Cricket Pro" />
                      <CopyItem label="Account Number" value="1000 2345 6789" />
                  </div>
                  
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
          </div>
      )}
    </div>
  );
};

export default VIPPackages;