import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Hash, Users, Trash2, PencilLine, AlertCircle, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5"></div>
    ))}
  </div>
);

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [stats, setStats] = useState({}); // To easily show how many students per class
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ class_id: '', class_name: '', advisor: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, statsRes] = await Promise.all([
        api.get('/classes'),
        api.get('/stats')
      ]);
      setClasses(classRes.data);
      
      // Build a map of class name -> student count
      const statMap = {};
      statsRes.data.students_by_class.forEach(s => {
        statMap[s.class_name] = s.count;
      });
      setStats(statMap);

    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lớp học:', err);
      toast.error('Lỗi kết nối máy chủ backend khi tải lớp học.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (class_id, class_name) => {
    const loadingToast = toast.loading(`Đang xoá lớp ${class_name}...`);
    try {
      await api.delete(`/classes/${class_id}`);
      setClasses(classes.filter(c => c.class_id !== class_id));
      toast.success(`Đã xoá lớp ${class_name}`, { id: loadingToast });
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error('Lỗi khi xoá lớp. Có thể vẫn còn sinh viên thuộc lớp này.', { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const openForm = (classData = null) => {
    if (classData) {
      setEditingClass(classData);
      setFormData(classData);
    } else {
      setEditingClass(null);
      setFormData({ class_id: '', class_name: '', advisor: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingClass ? 'Đang cập nhật lớp...' : 'Đang tạo lớp...');
    try {
      if (editingClass) {
        const { class_id, ...updateData } = formData;
        const res = await api.put(`/classes/${class_id}`, updateData);
        setClasses(classes.map(c => c.class_id === class_id ? res.data : c));
        toast.success('Cập nhật lớp thành công!', { id: loadingToast });
      } else {
        const res = await api.post('/classes', formData);
        setClasses([...classes, res.data]);
        toast.success('Đã thêm lớp cấu trúc mới!', { id: loadingToast });
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Lỗi xử lý dữ liệu lớp học.', { id: loadingToast });
    }
  };

  const filteredClasses = classes.filter(c => 
    c.class_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.class_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.advisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Cấu Trúc <span className="text-gradient">Lớp Học</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl font-light">
            Quản lý và thiết lập danh sách lớp thuộc quyền.
          </p>
        </div>
        
        <button 
          onClick={() => openForm(null)}
          className="flex-shrink-0 inline-flex items-center px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all glow-primary"
        >
          <BookOpen className="w-5 h-5 mr-2" /> Thêm Lớp Mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-1.5 flex items-center relative overflow-hidden focus-within:ring-2 ring-indigo-500/50 transition-all duration-300 group">
        <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-transparent border-0 py-4 pl-14 pr-4 text-white placeholder-slate-400 focus:ring-0 focus:outline-none sm:text-base font-medium"
          placeholder="Tìm kiếm theo mã lớp, tên lớp, hoặc cố vấn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-t-2 border-t-indigo-500/50">
        
        {loading ? (
           <div className="p-8"><LoadingSkeleton /></div>
        ) : (
          <div className="overflow-x-auto print:overflow-visible">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-indigo-400" /> Mã Lớp</span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Tên Lớp
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Cố vấn học tập (Advisor)
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-400" /> Số Sinh viên</span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-right text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 relative">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((c, idx) => {
                    const isDeleting = deletingId === c.class_id;
                    const studentCount = stats[c.class_name] || 0;

                    return (
                      <tr 
                        key={c.class_id} 
                        className={`hover:bg-white/10 transition-all duration-300 group ${isDeleting ? 'bg-rose-500/10 animate-pulse-slow' : 'animate-fade-in'}`}
                        style={{animationDelay: `${idx * 0.05}s`}}
                      >
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-white">
                          <span className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 font-mono tracking-wider">{c.class_id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-base font-bold text-white block">{c.class_name}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-300 font-medium">
                          {c.advisor}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm tracking-wide">
                            {studentCount} Học viên
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          
                          {/* INLINE DELETE CONFIRMATION */}
                          {isDeleting ? (
                            <div className="flex items-center justify-end space-x-2 animate-fade-in">
                              <span className="text-xs text-rose-300 font-semibold mr-1">Xoá vĩnh viễn?</span>
                              <button
                                onClick={() => executeDelete(c.class_id, c.class_name)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors font-bold shadow-sm"
                              >
                                Có
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-bold shadow-sm"
                              >
                                Không
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-3 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openForm(c)}
                                className="text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/40 p-2.5 rounded-xl transition-all border border-indigo-500/20 hover:border-indigo-400 shadow-sm"
                                title="Sửa Lớp"
                              >
                                <PencilLine className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(c.class_id)}
                                disabled={studentCount > 0}
                                className={`p-2.5 rounded-xl transition-all border shadow-sm leading-none ${
                                  studentCount > 0 
                                  ? 'text-slate-500 bg-white/5 border-white/5 cursor-not-allowed opacity-50' 
                                  : 'text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/40 border-rose-500/20 hover:border-rose-400'
                                }`}
                                title={studentCount > 0 ? "Không thể xoá lớp đang có sinh viên" : "Xóa Lớp"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 bg-white/5">
                      Không tìm thấy kết quả nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Class Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative glass-panel border border-white/20 p-8 w-full max-w-md animate-modal shadow-[0_25px_50px_rgba(0,0,0,0.8)]">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 pr-8">
              {editingClass ? 'Sửa thông tin Lớp' : 'Thêm Lớp học Mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Mã Lớp</label>
                <input
                  required disabled={!!editingClass}
                  type="text"
                  placeholder="VD: C06"
                  value={formData.class_id}
                  onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  className={`block w-full px-4 py-3 font-medium ${editingClass ? 'bg-white/5 text-slate-500 border-dashed border-white/10 rounded-xl cursor-not-allowed' : 'glass-input'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Tên Lớp (Chuyên ngành)</label>
                <input
                  required type="text"
                  placeholder="VD: Khoa học máy tính 3"
                  value={formData.class_name}
                  onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                  className="block w-full px-4 py-3 glass-input font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Cố vấn học tập</label>
                <input
                  required type="text"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.advisor}
                  onChange={(e) => setFormData({...formData, advisor: e.target.value})}
                  className="block w-full px-4 py-3 glass-input font-medium"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-primary transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" /> {editingClass ? 'Cập Nhật Lớp' : 'Lưu Lớp Học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassList;
