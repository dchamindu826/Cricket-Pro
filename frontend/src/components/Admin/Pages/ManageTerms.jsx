import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const ManageTerms = () => {
    const [termsList, setTermsList] = useState(['']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('https://cricket-pro-three.vercel.app/api/terms') 
            .then(res => {
                if (!res.ok) throw new Error('API not found');
                return res.json();
            })
            .then(data => {
                if (data && data.content) {
                    try {
                        const parsed = JSON.parse(data.content);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setTermsList(parsed);
                        } else {
                            setTermsList([data.content]);
                        }
                    } catch (e) {
                        setTermsList([data.content]);
                    }
                }
            })
            .catch(err => console.error("Terms API Error: ", err));
    }, []);

    const handleTermChange = (index, value) => {
        const newList = [...termsList];
        newList[index] = value;
        setTermsList(newList);
    };

    const addTerm = () => setTermsList([...termsList, '']);
    
    const removeTerm = (index) => {
        const newList = termsList.filter((_, i) => i !== index);
        setTermsList(newList.length === 0 ? [''] : newList); 
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const filteredTerms = termsList.filter(t => t.trim() !== '');
            const contentToSave = JSON.stringify(filteredTerms);

            const res = await fetch('https://cricket-pro-three.vercel.app/api/terms', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave })
            });
            const data = await res.json();
            if(data.success) alert('Terms updated successfully!');
        } catch (error) {
            alert('Error updating terms. Backend එක Live ද කියලා බලන්න.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0b1b36] rounded-2xl border border-slate-700 p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Manage Terms & Conditions</h2>
            
            <div className="space-y-4 mb-6 md:mb-8">
                {termsList.map((term, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                        
                        {/* Mobile Header (Number & Trash Button) */}
                        <div className="flex justify-between w-full sm:w-auto items-center">
                            <div className="bg-slate-800 text-slate-400 font-bold w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-lg">
                                {index + 1}
                            </div>
                            <button 
                                onClick={() => removeTerm(index)}
                                className="sm:hidden text-red-400 bg-red-500/10 p-2 rounded-lg"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>

                        <textarea 
                            value={term}
                            onChange={(e) => handleTermChange(index, e.target.value)}
                            className="w-full flex-1 min-h-[100px] md:min-h-[80px] bg-[#020c1b] text-white border border-slate-700 rounded-xl p-3 focus:border-neon-blue focus:outline-none resize-y text-sm md:text-base"
                            placeholder="Enter term condition here..."
                        />

                        {/* Desktop Trash Button */}
                        <button 
                            onClick={() => removeTerm(index)}
                            className="hidden sm:block bg-red-500/10 text-red-500 p-3 md:p-4 rounded-lg hover:bg-red-500 hover:text-white transition mt-1"
                            title="Remove Term"
                        >
                            <FiTrash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                    onClick={addTerm} 
                    className="w-full sm:w-auto bg-slate-800 text-neon-blue px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-700 transition"
                >
                    <FiPlus /> Add New Term
                </button>

                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="w-full sm:w-auto bg-neon-blue text-[#020c1b] px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#00b3cc] transition sm:ml-auto"
                >
                    <FiSave /> {loading ? 'Saving...' : 'Save All Terms'}
                </button>
            </div>
        </div>
    );
};

export default ManageTerms;