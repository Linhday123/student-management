import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserPlus, GraduationCap, Github, Home, Users, BookOpen } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import ClassList from './components/ClassList';
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
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl group-hover:from-indigo-400 group-hover:to-purple-500 transition-all glow-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                Linhday123
              </span>
              <span className="block text-xs font-medium text-slate-400 tracking-wider uppercase -mt-1">
                Quản lý Sinh viên
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 md:space-x-6">
            
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/dashboard' || location.pathname === '/'
                  ? 'bg-slate-800/50 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </Link>

            <Link 
              to="/classes" 
              className={`flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/classes'
                  ? 'bg-slate-800/50 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Lớp Học</span>
            </Link>

            <Link 
              to="/students" 
              className={`flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/students' || location.pathname === '/add' || location.pathname.startsWith('/edit')
                  ? 'bg-slate-800/50 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Hồ sơ SV</span>
            </Link>

            <div className="h-6 w-px bg-white/10 hidden md:block mx-2"></div>
            
            <a 
              href="https://github.com/Linhday123/student-management" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              title="Xem trên GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      {/* Toast Notifications Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          }
        }}
      />

      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-slate-900">
        
        {/* Decorative Background Elements (Glassmorphism Orbs) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[130px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-purple-600/20 blur-[130px]"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-pink-600/10 blur-[130px]"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative z-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/classes" element={<ClassList />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/add" element={<StudentForm />} />
              <Route path="/edit/:id" element={<StudentForm />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="py-8 mt-auto text-center border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-slate-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} <span className="text-indigo-400">Linhday123</span>. Thiết kế bằng <span className="text-pink-500 mx-1">♥</span> và Tailwind Glassmorphism.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
