import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User, Users } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors">
                  <Users className="h-6 w-6" />
                  <span className="font-bold text-xl tracking-wide">Student Management</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link 
                  to="/add" 
                  className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Add Student</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/add" element={<StudentForm />} />
            <Route path="/edit/:id" element={<StudentForm />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white py-6 border-t border-gray-200 mt-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Student Management System. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
