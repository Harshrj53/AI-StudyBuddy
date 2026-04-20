import React, { useState, useEffect } from 'react';
import { 
  Library as LibraryIcon, 
  Search, 
  FileText, 
  Trash2, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  Calendar,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import * as api from '../services/api';

const Library = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await api.getAllNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete these notes?')) return;
    
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-8 border-b border-border bg-card/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Library</h1>
            <p className="text-muted-foreground mt-1">Manage and review all your AI-generated study materials.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by topic or title..."
              className="w-full bg-card border border-border rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full lg:w-[400px] border-r border-border bg-card/30 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">No notes found matching your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:bg-secondary relative group",
                    selectedNote?.id === note.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={cn("font-bold transition-colors", selectedNote?.id === note.id ? "text-primary" : "text-foreground group-hover:text-primary")}>
                      {note.title}
                    </h3>
                    <button 
                      onClick={(e) => handleDelete(note.id, e)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded uppercase font-bold text-[10px] tracking-wider">{note.topic}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto bg-background p-10">
          {selectedNote ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">{selectedNote.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                      {selectedNote.topic}
                    </span>
                    <span className="flex items-center gap-2">
                       <Calendar size={14} />
                       Saved on {new Date(selectedNote.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 shadow-lg active:scale-95 transition-all">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-10 shadow-sm min-h-[500px]">
                <div className="prose prose-sm max-w-none text-foreground prose-h1:text-3xl prose-h1:font-bold prose-p:text-base prose-p:leading-relaxed prose-li:text-base">
                  {selectedNote.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">
                      {line.startsWith('#') ? (
                        <strong className="text-2xl text-primary font-bold block mt-8 mb-4">{line.replace(/#/g, '').trim()}</strong>
                      ) : line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="bg-secondary p-8 rounded-full mb-6">
                <LibraryIcon size={64} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Knowledge Hub</h2>
              <p className="max-w-xs text-muted-foreground">Select a note from the sidebar to view its contents and start studying.</p>
              <div className="mt-8 flex flex-col items-center gap-2">
                <ChevronDown className="animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-widest">Select to preview</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
