import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PencilLine, Trash2, Search, User, BookOpen, Star, Hash, GraduationCap, Loader2, AlertCircle, X, Check, Download, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5"></div>
    ))}
  </div>
);

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Trạng thái inline delete

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Lỗi kết nối máy chủ backend. Đảm bảo FastAPI đang chạy ở cổng 8000.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (student_id, name) => {
    const loadingToast = toast.loading(`Đang xoá sinh viên ${name}...`);
    try {
      await api.delete(`/students/${student_id}`);
      setStudents(students.filter(student => student.student_id !== student_id));
      toast.success(`Đã xoá hồ sơ ${name}`, { id: loadingToast });
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Lỗi khi xoá hồ sơ sinh viên.', { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    if (students.length === 0) {
      toast.error('Không có dữ liệu để xuất.');
      return;
    }
    const headers = ['Mã SV', 'Họ Tên', 'Năm sinh', 'Ngành học', 'GPA'].join(',');
    const rows = students.map(s => [s.student_id, `"${s.name}"`, s.birth_year, `"${s.major}"`, s.gpa].join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n'); // Add BOM for UTF-8
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh_sach_sinh_vien.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Xuất file CSV thành công!');
  };

  // Statistics Calculation
  const avgGpa = students.length > 0 
    ? (students.reduce((acc, curr) => acc + curr.gpa, 0) / students.length).toFixed(2) 
    : "0.00";
  const uniqueMajors = new Set(students.map(s => s.major)).size;

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Hệ thống <span className="text-gradient">Quản lý Sinh viên</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl font-light">
            Theo dõi và cập nhật hồ sơ, thông tin học thuật của sinh viên trong cơ sở dữ liệu.
          </p>
        </div>

        <div className="flex space-x-3 flex-shrink-0">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-4 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all shadow-sm"
          >
            <Download className="w-5 h-5 mr-2" /> Xuất CSV
          </button>
          <Link
            to="/add"
            className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-sm"
          >
            <UserPlus className="w-5 h-5 mr-2" /> Thêm Sinh viên
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center space-x-4 glass-panel-hover overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 bg-indigo-500/10 w-24 h-24 rounded-full blur-xl pointer-events-none"></div>
          <div className="bg-indigo-500/20 p-3.5 rounded-2xl border border-indigo-500/30">
            <User className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">Tổng sinh viên</p>
            <h3 className="text-3xl font-extrabold text-white">{students.length}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center space-x-4 glass-panel-hover overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 bg-emerald-500/10 w-24 h-24 rounded-full blur-xl pointer-events-none"></div>
          <div className="bg-emerald-500/20 p-3.5 rounded-2xl border border-emerald-500/30">
            <Star className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">GPA Trung bình</p>
            <h3 className="text-3xl font-extrabold text-white">{avgGpa}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center space-x-4 glass-panel-hover overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 bg-purple-500/10 w-24 h-24 rounded-full blur-xl pointer-events-none"></div>
          <div className="bg-purple-500/20 p-3.5 rounded-2xl border border-purple-500/30">
            <BookOpen className="h-6 w-6 text-purple-400" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">Số ngành học</p>
            <h3 className="text-3xl font-extrabold text-white">{uniqueMajors}</h3>
          </div>
        </div>
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
          placeholder="Tìm kiếm theo tên, mã sinh viên hoặc ngành học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="glass-panel !bg-rose-500/10 !border-rose-500/30 p-4 flex items-start">
          <div className="bg-rose-500/20 p-1.5 rounded-lg mr-3 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-sm text-rose-200 font-medium leading-relaxed pt-1.5">{error}</p>
        </div>
      )}

      {/* Main Content Area Lineup */}
      <div className="glass-panel overflow-hidden relative border-t-2 border-t-indigo-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        
        {loading ? (
           <div className="p-8"><LoadingSkeleton /></div>
        ) : students.length === 0 && !error ? (
          // Empty State
          <div className="p-16 text-center animate-fade-in relative">
            <div className="absolute right-[20%] top-[20%] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute left-[20%] bottom-[20%] w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="inline-flex justify-center items-center w-28 h-28 rounded-full glass-panel mb-6 relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <GraduationCap className="h-14 w-14 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Chưa có sinh viên nào</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium text-lg relative z-10">
              Cơ sở dữ liệu đang trống. Hãy thêm sinh viên đầu tiên để bắt đầu lưu trữ thông tin.
            </p>
            <Link
              to="/add"
              className="relative z-10 inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all glow-primary"
            >
              Thêm Thông Tin
            </Link>
          </div>
        ) : (
          // Data Table
          <div className="overflow-x-auto print:overflow-visible">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-indigo-400" /> Mã SV</span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Họ Tên
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Năm sinh
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Ngành học
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    GPA
                  </th>
                  <th scope="col" className="px-6 py-5 text-right text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 relative">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => {
                    const isExcellent = student.gpa >= 3.5;
                    const isGood = student.gpa >= 2.5 && student.gpa < 3.5;
                    // const isPoor = student.gpa < 2.5;

                    const isDeleting = deletingId === student.student_id;

                    return (
                      <tr 
                        key={student.student_id} 
                        className={`hover:bg-white/10 transition-all duration-300 group ${isDeleting ? 'bg-rose-500/10 animate-pulse-slow' : 'animate-fade-in'}`}
                        style={{animationDelay: `${idx * 0.05}s`}}
                      >
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-white">
                          <span className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 font-mono tracking-wider">{student.student_id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-white/20">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <span className="text-base font-bold text-white block">{student.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-300 font-medium">
                          {student.birth_year}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm tracking-wide">
                            {student.major}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border shadow-sm ${
                            isExcellent ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' : 
                            isGood ? 'bg-amber-500/10 border-amber-500/30' : 
                            'bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                          }`}>
                            <div className={`h-2 w-2 rounded-full mr-2.5 shadow-[0_0_5px_currentColor] ${
                              isExcellent ? 'bg-emerald-400 text-emerald-400' : 
                              isGood ? 'bg-amber-400 text-amber-400' : 
                              'bg-rose-400 text-rose-400'
                            }`}></div>
                            <span className={`text-sm font-bold tracking-wide ${
                              isExcellent ? 'text-emerald-300' : 
                              isGood ? 'text-amber-300' : 
                              'text-rose-300'
                            }`}>
                              {student.gpa.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          
                          {/* INLINE DELETE CONFIRMATION */}
                          {isDeleting ? (
                            <div className="flex items-center justify-end space-x-2 animate-fade-in">
                              <span className="text-xs text-rose-300 font-semibold mr-1">Bạn chắc chứ?</span>
                              <button
                                onClick={() => executeDelete(student.student_id, student.name)}
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
                                onClick={() => navigate(`/edit/${student.student_id}`, { state: { student } })}
                                className="text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/40 p-2.5 rounded-xl transition-all border border-indigo-500/20 hover:border-indigo-400 shadow-sm"
                                title="Sửa Hồ sơ"
                              >
                                <PencilLine className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(student.student_id)}
                                className="text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/40 p-2.5 rounded-xl transition-all border border-rose-500/20 hover:border-rose-400 shadow-sm leading-none"
                                title="Xóa Hồ sơ"
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
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 bg-white/5">
                      Không tìm thấy kết quả nào phù hợp với "<span className="font-semibold text-white">{searchTerm}</span>"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
