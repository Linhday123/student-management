import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Save, X, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    birth_year: new Date().getFullYear() - 20, // Default to ~20 years old
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
        // Fetch student if state isn't available
        fetchStudent(id);
      }
    }
  }, [id, isEditMode, location.state]);

  const fetchStudent = async (studentId) => {
    try {
      setLoading(true);
      const response = await api.get('/students'); // Simplification: filter from all
      const student = response.data.find(s => s.student_id === studentId);
      if (student) {
        setFormData(student);
      } else {
        setError("Student not found.");
      }
    } catch (err) {
      console.error("Error fetching student Details", err);
      setError("Failed to fetch student details.");
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
      parsedValue = parseFloat(value) || 0.0;
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
      // Input validation
      if (formData.gpa < 0 || formData.gpa > 4.0) {
        throw new Error("GPA must be between 0.0 and 4.0");
      }

      if (isEditMode) {
        // Update
        const { student_id, ...updateData } = formData;
        await api.put(`/students/${id}`, updateData);
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        // Create
        await api.post('/students', formData);
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error('Error saving student:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to save student. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center">
        <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Student' : 'Add New Student'}
        </h1>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start shadow-sm">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">
            Student successfully {isEditMode ? 'updated' : 'added'}! Redirecting...
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-1 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="student_id"
                  id="student_id"
                  required
                  disabled={isEditMode}
                  value={formData.student_id}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 pl-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border ${
                    isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="e.g., S12345"
                />
              </div>
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-500">Student ID cannot be changed.</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border pl-4 py-3"
                  placeholder="e.g., Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="birth_year" className="block text-sm font-medium text-gray-700">
                Birth Year
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="birth_year"
                  id="birth_year"
                  required
                  min="1900"
                  max="2100"
                  value={formData.birth_year || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border pl-4 py-3"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                GPA
              </label>
              <div className="mt-1">
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border pl-4 py-3"
                  placeholder="0.0 - 4.0"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Major
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="major"
                  id="major"
                  required
                  value={formData.major}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border pl-4 py-3"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-gray-100">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <X className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading || success ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
              }`}
            >
              <Save className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              {loading ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
