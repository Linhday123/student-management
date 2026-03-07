import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Award, Loader2, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        toast.error('Lỗi khi tải dữ liệu thống kê từ máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Đang xử lý dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel !bg-rose-500/10 !border-rose-500/30 p-8 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-rose-400 mr-3" />
        <p className="text-lg text-rose-200">Không thể tải dữ liệu Thống kê. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
          Bảng Điều Khiển <span className="text-gradient">Tổng Quan</span>
        </h1>
        <p className="mt-2 text-lg text-slate-400 max-w-2xl font-light">
          Trực quan hóa dữ liệu thống kê sinh viên, hiệu suất học tập và phân bổ cấu trúc chuyên ngành.
        </p>
      </div>

      {/* 4 Big Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 bg-indigo-500/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="bg-indigo-500/20 p-3.5 rounded-2xl border border-indigo-500/30 w-fit mb-4">
            <Users className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white">{stats.total_students}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Tổng Sinh Viên</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 bg-emerald-500/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="bg-emerald-500/20 p-3.5 rounded-2xl border border-emerald-500/30 w-fit mb-4">
            <Award className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white">{stats.average_gpa}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">GPA Trung Bình</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 bg-amber-500/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="bg-amber-500/20 p-3.5 rounded-2xl border border-amber-500/30 w-fit mb-4">
            <BookOpen className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white">{stats.students_by_class.length}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Lớp Học Trực Thuộc</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 bg-pink-500/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="bg-pink-500/20 p-3.5 rounded-2xl border border-pink-500/30 w-fit mb-4">
            <GraduationCap className="h-6 w-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white">{stats.students_by_major.length}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Chuyên Ngành</p>
          </div>
        </div>
      </div>

      {/* Charts Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart: Majors */}
        <div className="glass-panel p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center">
            Sinh viên theo Ngành học
          </h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.students_by_major} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="major" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {stats.students_by_major.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Classes */}
        <div className="glass-panel p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center">
            Phân bố theo Lớp học
          </h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.students_by_class}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="class_name"
                  stroke="none"
                >
                  {stats.students_by_class.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
