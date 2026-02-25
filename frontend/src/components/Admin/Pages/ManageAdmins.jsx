import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShield, FiTrash2, FiEdit2, FiPlus, FiX } from 'react-icons/fi';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', username: '', password: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setIsEditing(true);
      setFormData({ id: admin.id, username: admin.username, password: '' }); // Leave password blank so they type a new one
    } else {
      setIsEditing(false);
      setFormData({ id: '', username: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        if(!formData.password) return alert("Please enter a new password for this user.");
        await axios.put(`http://localhost:5000/api/admin/users/${formData.id}`, {
          username: formData.username,
          password: formData.password
        });
        alert("Admin updated successfully!");
      } else {
        await axios.post('http://localhost:5000/api/admin/users', {
          username: formData.username,
          password: formData.password
        });
        alert("New Admin created!");
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (admins.length <= 1) return alert("You cannot delete the last remaining admin!");
    if (!window.confirm("Are you sure you want to delete this admin account?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (error) {
      alert("Error deleting admin.");
    }
  };

  if (loading) return <div className="text-center text-neon-blue mt-20 animate-pulse font-bold">Loading Admins...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <FiShield className="text-neon-blue" /> Admin Credentials
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage who has access to the CricPro Admin Panel.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-neon-blue hover:bg-teal-400 text-slate-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition">
          <FiPlus /> Add Admin
        </button>
      </div>

      <div className="bg-[#0b1b36] rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-bold">Username</th>
              <th className="px-6 py-4 font-bold">Created Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-neon-blue">
                    {admin.username.charAt(0).toUpperCase()}
                  </div>
                  {admin.username}
                </td>
                <td className="px-6 py-4">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleOpenModal(admin)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition mr-2" title="Edit">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition" title="Delete">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-3">
              {isEditing ? 'Edit Admin Credentials' : 'Create New Admin'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Username</label>
                <input 
                  type="text" required value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password {isEditing && "(Enter New Password)"}</label>
                <input 
                  type="text" required value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue" 
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-neon-blue to-[#00b3cc] text-slate-900 font-bold py-3 rounded-xl mt-4">
                {isEditing ? 'Update Admin' : 'Save New Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;