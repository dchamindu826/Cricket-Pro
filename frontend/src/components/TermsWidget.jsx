import React, { useState, useEffect } from 'react';
import { FiFileText, FiX } from 'react-icons/fi';

const TermsWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [termsList, setTermsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && termsList.length === 0) {
            setLoading(true);
            fetch('https://cricket-pro-three.vercel.app/api/terms')
                .then(res => res.json())
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
        }
    }, [isOpen]);

    return (
        <>
            {/* Floating Button (Mobile වල පොඩ්ඩක් උඩට ගත්තා WhatsApp Button එක එක්ක හැප්පෙන්නේ නැති වෙන්න) */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-40 bg-gradient-to-r from-neon-blue to-[#00b3cc] text-[#020c1b] px-3 md:px-4 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
            >
                <FiFileText size={18} /> <span className="hidden md:inline">Terms & Conditions</span><span className="md:hidden">Terms</span>
            </button>

            {/* Modal - Mobile Optimized */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-[#0b1b36] border border-neon-blue/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-700">
                            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2"><FiFileText className="text-neon-blue"/> Terms</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><FiX size={20}/></button>
                        </div>
                        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <p className="text-slate-400 text-center py-8">Loading terms...</p>
                            ) : termsList.length > 0 ? (
                                <ol className="list-decimal pl-4 md:pl-5 space-y-3 md:space-y-4 text-sm md:text-base text-slate-300 leading-relaxed marker:text-neon-blue marker:font-bold">
                                    {termsList.map((term, index) => (
                                        <li key={index} className="pl-1 md:pl-2">{term}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-slate-400 text-center py-8">No terms available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default TermsWidget;