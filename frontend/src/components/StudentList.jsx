import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilLine, Trash2, Search, User, BookOpen, Star, Hash, GraduationCap, Loader2 } from 'lucide-react';
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
      setError('Connection to backend server failed. Ensure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student_id, name) => {
    if (window.confirm(`Delete record for ${name}? This action is irreversible.`)) {
      try {
        await api.delete(`/students/${student_id}`);
        setStudents(students.filter(student => student.student_id !== student_id));
        // Optional: you could add a toast here instead of window.alert
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Encountered an error while deleting the record.');
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics Calculation
  const avgGpa = students.length > 0 
    ? (students.reduce((acc, curr) => acc + curr.gpa, 0) / students.length).toFixed(2) 
    : "0.00";
  const uniqueMajors = new Set(students.map(s => s.major)).size;

  return (
    <div className="space-y-8">
      
      {/* Header text with Gradient */}
      <div className="mb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          System <span className="text-gradient">Directory</span>
        </h1>
        <p className="mt-3 text-lg text-slate-400 max-w-2xl font-light">
          Manage and oversee all registered student information in the central database.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30">
            <User className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Students</p>
            <h3 className="text-2xl font-bold text-white">{students.length}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
            <Star className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Average GPA</p>
            <h3 className="text-2xl font-bold text-white">{avgGpa}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-500/30">
            <BookOpen className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Majors</p>
            <h3 className="text-2xl font-bold text-white">{uniqueMajors}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-2 flex items-center">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-0 py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:ring-0 focus:outline-none sm:text-base font-medium"
            placeholder="Search by name, student ID, or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start backdrop-blur-md">
          <div className="bg-rose-500/20 p-1.5 rounded-lg mr-3 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <span className="text-rose-400 font-bold px-1.5">!</span>
          </div>
          <p className="text-sm text-rose-200 font-medium leading-relaxed pt-1">{error}</p>
        </div>
      )}

      {/* Main Content Area Lineup */}
      <div className="glass-panel overflow-hidden relative border-t-2 border-t-indigo-500/50">
        
        {loading ? (
           <div className="p-8"><LoadingSkeleton /></div>
        ) : students.length === 0 && !error ? (
          // Empty State
          <div className="p-16 text-center">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-white/5 border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <GraduationCap className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No students found</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
              Your roster is currently empty. Add your first student to get started tracking records.
            </p>
            <Link
              to="/add"
              className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Add First Student
            </Link>
          </div>
        ) : (
          // Data Table
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-900/60">
                <tr>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-indigo-400" /> ID</span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Birth Year
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Major
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    GPA
                  </th>
                  <th scope="col" className="px-6 py-5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isExcellent = student.gpa >= 3.5;
                    const isGood = student.gpa >= 2.5 && student.gpa < 3.5;
                    const isPoor = student.gpa < 2.5;

                    return (
                      <tr key={student.student_id} className="hover:bg-white/5 transition-colors group animate-fade-in relative">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-white">
                          <span className="bg-white/10 px-2 py-1 rounded-md border border-white/5">{student.student_id}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(99,102,241,0.3)] border border-white/20">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <span className="text-sm font-bold text-white block">{student.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-300 font-medium">
                          {student.birth_year}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm">
                            {student.major}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border ${
                            isExcellent ? 'bg-emerald-500/10 border-emerald-500/30' : 
                            isGood ? 'bg-amber-500/10 border-amber-500/30' : 
                            'bg-rose-500/10 border-rose-500/30'
                          }`}>
                            <div className={`h-1.5 w-1.5 rounded-full mr-2 shadow-[0_0_5px_currentColor] ${
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
                          <div className="flex justify-end space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/edit/${student.student_id}`}
                              state={{ student }}
                              className="text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/30 p-2.5 rounded-xl transition-all border border-indigo-500/20 hover:border-indigo-400 shadow-sm"
                              title="Edit Record"
                            >
                              <PencilLine className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(student.student_id, student.name)}
                              className="text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/40 p-2.5 rounded-xl transition-all border border-rose-500/20 hover:border-rose-400 shadow-sm leading-none"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No matching records found for "<span className="font-semibold text-white">{searchTerm}</span>"
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
