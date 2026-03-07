import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Save, ArrowLeft, UserCircle2, BookOpen, Hash, Calendar, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    birth_year: new Date().getFullYear() - 20,
    major: '',
    gpa: 0.0,
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.student) {
        setFormData(location.state.student);
      } else {
        fetchStudent(id);
      }
    }
  }, [id, isEditMode, location.state]);

  const fetchStudent = async (studentId) => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      const student = response.data.find(s => s.student_id === studentId);
      if (student) {
        setFormData(student);
      } else {
         toast.error("Không tìm thấy thông tin sinh viên.");
      }
    } catch (err) {
      console.error("Error fetching student Details", err);
      toast.error("Lỗi khi kết nối với máy chủ dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    if (name === 'birth_year') {
      parsedValue = parseInt(value) || 0;
    } else if (name === 'gpa') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.gpa < 0 || formData.gpa > 4.0) {
        throw new Error("Điểm GPA phải nằm trong khoảng từ 0.0 đến 4.0.");
      }

      const toastId = toast.loading(isEditMode ? 'Đang cập nhật hồ sơ...' : 'Đang lưu sinh viên mới...');

      if (isEditMode) {
        const { student_id, ...updateData } = formData;
        await api.put(`/students/${id}`, updateData);
        toast.success('Đã cập nhật hồ sơ thành công!', { id: toastId });
      } else {
        await api.post('/students', formData);
        toast.success('Đã thêm sinh viên vào hệ thống!', { id: toastId });
      }
      
      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      console.error('Error handling submission:', err);
      let errMsg = 'Có lỗi nghiêm trọng xảy ra khi xử lý.';
      
      if (err.response?.data?.detail) {
        errMsg = err.response.data.detail;
      } else if (err.message) {
        errMsg = err.message;
      }
      
      toast.error(errMsg);
      setLoading(false);
    }
  };

  // GPA visual indicator calculate
  const getGpaColorInfo = (val) => {
    if(val >= 3.5) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    if(val >= 2.5) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]";
  };

  return (
    <div className="max-w-3xl mx-auto animate-modal relative z-20">
      {/* Header and Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Link 
            to="/" 
            className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg group relative overflow-hidden"
          >
            {/* Hover Glow Effect inside back button */}
            <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ArrowLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {isEditMode ? 'Chỉnh sửa Hồ sơ' : 'Khai báo Tân sinh viên'}
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              {isEditMode ? 'Cập nhật lại thông tin cá nhân và học thuật hiện tại.' : 'Đăng ký một cá nhân mới vào danh sách hệ thống đào tạo.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Glass Card */}
      <div className="glass-panel overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-t border-t-white/20">
        
        {/* Subtle animated background behind form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Visual Header Graphic */}
        <div className="h-28 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 relative overflow-hidden border-b border-white/10">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-10 relative z-10">
          
          {/* Form Header Avatar */}
          <div className="-mt-16 mb-10 flex justify-between items-end relative z-10">
            <div className="p-2.5 bg-slate-900 rounded-3xl shadow-2xl inline-block border border-white/10 relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
               <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-300 border border-white/5 relative z-10">
                 <UserCircle2 className="w-12 h-12" />
               </div>
            </div>
            {isEditMode && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 mb-2 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] tracking-wider">
                CHẾ ĐỘ CHỈNH SỬA
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            
            <div className="space-y-3 relative group">
              <label htmlFor="student_id" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <Hash className="w-4 h-4 mr-2 text-indigo-400" /> Mã Sinh viên (ID)
              </label>
              <input
                type="text"
                name="student_id"
                id="student_id"
                required
                disabled={isEditMode}
                value={formData.student_id}
                onChange={handleChange}
                className={`block w-full px-5 py-3.5 font-medium ${
                  isEditMode ? 'bg-white/5 text-slate-500 cursor-not-allowed border-dashed border-white/10 rounded-xl' : 'glass-input'
                }`}
                placeholder="VD: S202612345"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <UserCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> Họ và Tên Pháp lý
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-5 py-3.5 glass-input font-medium placeholder:text-slate-500"
                placeholder="VD: Nguyễn Văn A"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="major" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-400" /> Ngành / Chuyên ngành
              </label>
              <input
                type="text"
                name="major"
                id="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="block w-full px-5 py-3.5 glass-input font-medium placeholder:text-slate-500"
                placeholder="VD: Kỹ thuật Phần mềm"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="birth_year" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <Calendar className="w-4 h-4 mr-2 text-indigo-400" /> Năm sinh
              </label>
              <input
                type="number"
                name="birth_year"
                id="birth_year"
                required
                min="1900"
                max="2100"
                value={formData.birth_year || ''}
                onChange={handleChange}
                className="block w-full px-5 py-3.5 glass-input font-medium"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex justify-between items-center">
                <label htmlFor="gpa" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                  <GraduationCap className="w-4 h-4 mr-2 text-indigo-400" /> Điểm Trung bình Tích lũy (GPA)
                </label>
                {/* Real time GPA Badge */}
                <div className={`px-4 py-1.5 rounded-lg border text-sm font-bold flex items-center transition-colors duration-300 ${getGpaColorInfo(formData.gpa)}`}>
                  {formData.gpa > 0 ? formData.gpa.toFixed(2) : "0.00"}
                </div>
              </div>
              
              <div className="flex items-center space-x-5 bg-black/20 p-4 rounded-2xl border border-white/5">
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.01"
                  name="gpa"
                  value={formData.gpa || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
                <input
                  type="number"
                  name="gpa"
                  id="gpa"
                  required
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa || ''}
                  onChange={handleChange}
                  className="w-28 px-4 py-3 glass-input font-bold text-center text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-white/10">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/10 text-sm font-bold rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 shadow-sm"
            >
              Hủy bỏ thao tác
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-10 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 ${
                loading
                ? 'bg-indigo-500/50 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-primary transform hover:-translate-y-0.5'
              }`}
            >
              <Save className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              {loading ? 'Đang gửi...' : (isEditMode ? 'Lưu Thay đổi' : 'Ghi nhận Hồ sơ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
