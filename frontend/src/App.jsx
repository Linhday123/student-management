import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserPlus, GraduationCap, Github } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-t-0 rounded-none rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl group-hover:from-indigo-400 group-hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                EduManage
              </span>
              <span className="block text-xs font-medium text-slate-400 tracking-wider uppercase -mt-1">
                Student System
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/Linhday123/student-management" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <Link 
              to="/add" 
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 border ${
                location.pathname === '/add'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent hover:from-indigo-500 hover:to-purple-500 glow-primary'
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
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        
        {/* Decorative Background Elements (Glassmorphism Orbs) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-pink-600/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <Routes>
              <Route path="/" element={<StudentList />} />
              <Route path="/add" element={<StudentForm />} />
              <Route path="/edit/:id" element={<StudentForm />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="py-8 mt-auto text-center border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-slate-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} <span className="text-indigo-400">EduManage</span>. Crafted with <span className="text-pink-500 mx-1">♥</span> and Glassmorphism.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
