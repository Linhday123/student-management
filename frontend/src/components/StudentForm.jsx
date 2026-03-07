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
        setError("Warning: Student record could not be localized.");
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
        throw new Error("Grade Point Average calculation error: Must remain within 0.0 and 4.0 parameters.");
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
        setError('Transaction aborted. A critical fault occurred during processing.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header and Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? 'Modify Record' : 'Enroll Student'}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {isEditMode ? 'Update academic information and details.' : 'Register a new individual into the academic roster.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
          <p className="text-base text-emerald-800 font-medium">
            Record successfully committed to the database! Redirecting...
          </p>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-start shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="bg-white p-1 rounded-full shadow-sm mr-3 flex-shrink-0">
            <span className="text-rose-500 font-bold px-2 py-0.5">!</span>
          </div>
          <p className="text-sm text-rose-800 font-medium leading-relaxed pt-1">
            {error}
          </p>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 overflow-hidden">
        {/* Visual Header Graphic */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
             {/* Abstract Pattern overlay */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border-4 border-white/20"></div>
             <div className="absolute bottom-4 right-12 w-16 h-16 rounded-full border-2 border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pt-8 pb-10">
          
          {/* Form Header Avatar Idea */}
          <div className="-mt-20 mb-8 flex justify-between items-end relative z-10">
            <div className="p-2 bg-white rounded-2xl shadow-sm inline-block border border-slate-100">
               <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                 <UserCircle2 className="w-12 h-12" />
               </div>
            </div>
            {isEditMode && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2 border border-amber-200 shadow-sm">
                EDITING MODE
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
            
            {/* Identity Group */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="student_id" className="flex items-center text-sm font-semibold text-slate-700">
                  <Hash className="w-4 h-4 mr-1.5 text-slate-400" /> Identifier (ID)
                </label>
                <input
                  type="text"
                  name="student_id"
                  id="student_id"
                  required
                  disabled={isEditMode}
                  value={formData.student_id}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border-slate-200 px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium ${
                    isEditMode ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-dashed' : 'bg-white shadow-sm border'
                  }`}
                  placeholder="e.g., S202612345"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-slate-700">
                  <UserCircle2 className="w-4 h-4 mr-1.5 text-slate-400" /> Full Legal Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                  placeholder="e.g., Katherine Johnson"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="md:col-span-2 border-t border-slate-100 my-2"></div>

            {/* Academic & Stats Group */}
            <div className="space-y-2">
              <label htmlFor="major" className="flex items-center text-sm font-semibold text-slate-700">
                <BookOpen className="w-4 h-4 mr-1.5 text-slate-400" /> Academic Major
              </label>
              <input
                type="text"
                name="major"
                id="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:font-normal"
                placeholder="e.g., Software Engineering"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="gpa" className="flex items-center text-sm font-semibold text-slate-700">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" /> Cumulative GPA
                </label>
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
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birth_year" className="flex items-center text-sm font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" /> Birth Year
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
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                />
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-10 pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 text-sm font-semibold rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all shadow-sm"
            >
              Cancel Operation
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent shadow-soft text-sm font-semibold rounded-full text-white transition-all ${
                loading || success 
                ? 'bg-indigo-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
