import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  GraduationCap, 
  Youtube, 
  Library as LibraryIcon,
  BookOpen
} from 'lucide-react';
import { cn } from '../utils/cn'; // I'll create this utility

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Chat Tutor', path: '/chat' },
    { icon: FileText, label: 'Notes Gen', path: '/notes' },
    { icon: GraduationCap, label: 'Quiz Hub', path: '/quiz' },
    { icon: Youtube, label: 'YouTube Explainer', path: '/youtube' },
    { icon: LibraryIcon, label: 'Library', path: '/library' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col pt-6 shadow-sm">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl">
          <BookOpen className="text-primary-foreground h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Study Buddy
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Progress</p>
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-[10px] text-muted-foreground">You've completed 12 hours of study this week. Keep it up!</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
