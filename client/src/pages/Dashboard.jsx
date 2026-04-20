import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Clock,
  ArrowRight,
  Plus,
  Youtube
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';
import * as api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ performanceHistory: [], topicsStudied: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Notes Created', value: stats.topicsStudied.length, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Quizzes Taken', value: stats.performanceHistory.length, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Avg Accuracy', value: stats.performanceHistory.length ? Math.round(stats.performanceHistory.reduce((acc, curr) => acc + curr.accuracy, 0) / stats.performanceHistory.length) + '%' : '0%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Study Hours', value: '12.4', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back, Harsh!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/chat" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm">
            <Plus className="h-4 w-4" /> Start Studying
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 card-hover shadow-sm">
            <div className={`${card.bg} p-3 rounded-xl`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Performance Trends
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.performanceHistory}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="created_at" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAccuracy)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4 flex-1">
            <Link to="/notes" className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Generate Notes</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/quiz" className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Take a Quiz</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/youtube" className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Youtube className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium">Explain Video</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              "The best way to predict the future is to create it."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
