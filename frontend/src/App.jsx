import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserPlus, Users, GraduationCap, Github } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-700 transition-colors shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                EduManage
              </span>
              <span className="block text-xs font-medium text-slate-500 -mt-1">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Linhday123/student-management" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <Link 
              to="/add" 
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 border ${
                location.pathname === '/add'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-soft hover:bg-slate-50'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>New Student</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-100/40 to-transparent blur-3xl opacity-50 rounded-full"></div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/add" element={<StudentForm />} />
            <Route path="/edit/:id" element={<StudentForm />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-8 mt-auto text-center border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} EduManage. Crafted with <span className="text-pink-500">♥</span> for beautiful UI.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
