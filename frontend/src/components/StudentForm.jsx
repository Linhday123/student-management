import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, UserCircle2, BookOpen, Hash, Calendar, GraduationCap } from 'lucide-react';
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
        setError("Student record could not be localized.");
      }
    } catch (err) {
      console.error("Error fetching student Details", err);
      setError("Communication breakdown communicating with the central database.");
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
    setError(null);
    setSuccess(false);

    try {
      if (formData.gpa < 0 || formData.gpa > 4.0) {
        throw new Error("GPA must remain within 0.0 and 4.0 parameters.");
      }

      if (isEditMode) {
        const { student_id, ...updateData } = formData;
        await api.put(`/students/${id}`, updateData);
        setSuccess(true);
        setTimeout(() => navigate('/'), 1200);
      } else {
        await api.post('/students', formData);
        setSuccess(true);
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (err) {
      console.error('Error handling submission:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('A critical fault occurred during processing.');
      }
      setLoading(false);
    }
  };

  // GPA visual indicator calculate
  const getGpaColorInfo = (val) => {
    if(val >= 3.5) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if(val >= 2.5) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-3xl mx-auto animate-modal">
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
              {isEditMode ? 'Modify Record' : 'Enroll Student'}
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              {isEditMode ? 'Update academic information and details in the system.' : 'Register a new individual into the academic roster.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="mb-8 glass-panel !bg-emerald-500/10 !border-emerald-500/30 p-5 flex items-center shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-fade-in">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 mr-3 flex-shrink-0" />
          <p className="text-base text-emerald-100 font-medium">
            Record successfully committed to the database! Redirecting...
          </p>
        </div>
      )}

      {error && (
        <div className="mb-8 glass-panel !bg-rose-500/10 !border-rose-500/30 p-5 flex items-start shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-fade-in">
          <div className="bg-rose-500/20 p-1.5 rounded-lg mr-3 shadow-inner">
            <span className="text-rose-400 font-bold px-1.5 flex items-center h-full">!</span>
          </div>
          <p className="text-sm text-rose-200 font-medium leading-relaxed pt-1.5">
            {error}
          </p>
        </div>
      )}

      {/* Main Form Glass Card */}
      <div className="glass-panel overflow-hidden relative">
        {/* Visual Header Graphic */}
        <div className="h-28 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 relative overflow-hidden border-b border-white/10">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-10">
          
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
                EDITING MODE
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            
            <div className="space-y-3 relative group">
              <label htmlFor="student_id" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <Hash className="w-4 h-4 mr-2 text-indigo-400" /> Identifier (ID)
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
                placeholder="e.g., S202612345"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <UserCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> Full Legal Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-5 py-3.5 glass-input font-medium"
                placeholder="e.g., Nova Stella"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="major" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-400" /> Academic Major
              </label>
              <input
                type="text"
                name="major"
                id="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="block w-full px-5 py-3.5 glass-input font-medium"
                placeholder="e.g., Quantum Computing"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="birth_year" className="flex items-center text-sm font-semibold text-slate-300 tracking-wide">
                <Calendar className="w-4 h-4 mr-2 text-indigo-400" /> Birth Year
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
                  <GraduationCap className="w-4 h-4 mr-2 text-indigo-400" /> Cumulative GPA
                </label>
                {/* Real time GPA Badge */}
                <div className={`px-3 py-1 rounded-md border text-sm font-bold flex items-center transition-colors duration-300 ${getGpaColorInfo(formData.gpa)}`}>
                  {formData.gpa > 0 ? formData.gpa.toFixed(2) : "0.00"}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.01"
                  name="gpa"
                  value={formData.gpa || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                  className="w-24 px-4 py-3 glass-input font-medium text-center"
                  placeholder="0.00"
                />
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-white/5">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/10 text-sm font-semibold rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-10 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 ${
                loading || success 
                ? 'bg-indigo-500/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-primary'
              }`}
            >
              <Save className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              {loading ? 'Processing...' : (isEditMode ? 'Commit Updates' : 'Execute Enrollment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
