import React, { useState, useEffect } from 'react';
import { FiShield } from 'react-icons/fi';
import NativeBanner from './NativeBanner'; // <-- Ad Banner එක Import කරගන්න

const TermsPage = () => {
    const [termsList, setTermsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch('https://cricket-pro-three.vercel.app/api/terms')
            .then(res => {
                if (!res.ok) throw new Error('API failed');
                return res.json();
            })
            .then(data => {
                try {
                    const parsed = JSON.parse(data.content);
                    if (Array.isArray(parsed)) setTermsList(parsed);
                    else setTermsList([data.content]);
                } catch (e) {
                    setTermsList([data.content]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 min-h-[80vh] relative z-20">
            
            {/* හිස් තැනට Banner Ad එක */}
            <div className="mb-8 w-full flex justify-center">
                <NativeBanner /> 
            </div>

            <div className="text-center mb-8 md:mb-12">
                <FiShield className="text-neon-blue text-4xl md:text-5xl mx-auto mb-4" />
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] uppercase tracking-widest">
                    Terms & Conditions
                </h1>
                <p className="text-slate-400 mt-2 md:mt-4 text-sm md:text-base">Please read our rules and guidelines carefully.</p>
            </div>
            
            {/* Mobile Optimization: Padding අඩු කළා (p-5 md:p-12) */}
            <div className="bg-[#0b1b36] border border-slate-700 p-5 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl">
                {loading ? (
                    <p className="text-slate-400 text-center py-10">Loading terms...</p>
                ) : termsList.length > 0 ? (
                    <ol className="list-decimal pl-5 md:pl-6 space-y-4 md:space-y-6 text-slate-300 text-base md:text-lg leading-relaxed marker:text-neon-blue marker:font-bold">
                        {termsList.map((term, index) => (
                            <li key={index} className="pl-1 md:pl-2">{term}</li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-slate-400 text-center py-10">No terms and conditions found.</p>
                )}
            </div>

            {/* යටින් තව Banner Ad එකක් ඕන නම් මෙතනට දාන්න */}
            <div className="mt-8 w-full flex justify-center">
                <NativeBanner /> 
            </div>
        </div>
    );
};

export default TermsPage;