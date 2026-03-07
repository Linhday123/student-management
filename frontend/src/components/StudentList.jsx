import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilLine, Trash2, FolderOpen, Loader2, AlertCircle, Search, Hash } from 'lucide-react';
import api from '../api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      setError('System could not connect to the backend server. Please verify it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student_id, name) => {
    if (window.confirm(`Are you certain you wish to remove ${name} from the system? This action cannot be undone.`)) {
      try {
        await api.delete(`/students/${student_id}`);
        setStudents(students.filter(student => student.student_id !== student_id));
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Encountered an error while attempting to delete the student record.');
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading State
  if (loading && students.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-indigo-500">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading student records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Directory</h1>
          <p className="mt-2 text-slate-500">Manage and oversee all registered student information.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm font-medium sm:text-sm"
            placeholder="Search by name, ID, or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 p-4 rounded-2xl flex items-start shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      {students.length === 0 && !loading && !error ? (
        // Empty State
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-soft border border-slate-200 p-16 text-center transition-all">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-6">
            <FolderOpen className="h-10 w-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Database is empty</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">
            You haven't added any students to the system yet. Begin by adding a new student profile.
          </p>
          <div className="mt-8">
            <Link
              to="/add"
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-glow"
            >
              Get Started
            </Link>
          </div>
        </div>
      ) : (
        // Data Table
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200/60 overflow-hidden relative">
          
          {/* subtle gradient at top of table */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> ID</span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Birth Year
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Major / Program
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Cum. GPA
                  </th>
                  <th scope="col" className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.student_id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {student.student_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-medium text-slate-900 block">{student.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {student.birth_year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {student.major}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            student.gpa >= 3.5 ? 'bg-emerald-500' : 
                            student.gpa >= 2.0 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}></div>
                          <span className={`text-sm font-bold ${
                            student.gpa >= 3.5 ? 'text-emerald-700' : 
                            student.gpa >= 2.0 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {student.gpa.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/edit/${student.student_id}`}
                            state={{ student }}
                            className="text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 p-2 rounded-lg transition-all border border-indigo-100 hover:border-indigo-600"
                            title="Edit Record"
                          >
                            <PencilLine className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(student.student_id, student.name)}
                            className="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-lg transition-all border border-rose-100 hover:border-rose-600 leading-none"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No matching records found for "<span className="font-semibold text-slate-900">{searchTerm}</span>"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination/Footer info area */}
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium tracking-wide text-center w-full">
              Showing {filteredStudents.length} of {students.length} entries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
