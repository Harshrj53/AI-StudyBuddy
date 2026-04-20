import React, { useState } from 'react';
import { Sparkles, Loader2, Save, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import * as api from '../services/api';

const NotesGenerator = () => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setNotes(null);
    setIsSaved(false);
    setError(null);

    try {
      const data = await api.generateNotes(topic);
      setNotes(data.content);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Notes Generator</h1>
        <p className="text-muted-foreground mt-1">Transform any topic into structured study notes instantly.</p>
      </header>

      <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">What do you want to learn about?</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 'Photosynthesis', 'World War II', 'Machine Learning'..."
              className="flex-1 bg-background border border-border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
            />
            <button 
              disabled={!topic.trim() || isLoading}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
            <p className="font-bold mb-1 uppercase text-[10px] tracking-widest">Connection Error</p>
            {error}
          </div>
        )}
      </div>

      {notes && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-secondary/30 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-bold">Study Notes: {topic}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsSaved(true)}
                disabled={isSaved}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm",
                  isSaved 
                    ? "bg-green-100 text-green-700 cursor-default" 
                    : "bg-white border border-border text-foreground hover:bg-secondary"
                )}
              >
                {isSaved ? <CheckCircle size={16} /> : <Save size={16} />}
                {isSaved ? 'Saved to Library' : 'Save Notes'}
              </button>
            </div>
          </div>
          <div className="p-10">
            <div className="prose prose-blue max-w-none prose-headings:font-bold prose-h1:text-4xl prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
              {/* In a real app we'd use react-markdown, but for now we'll display text with line breaks */}
              {notes.split('\n').map((line, i) => (
                <p key={i} className="mb-4">
                  {line.startsWith('#') ? (
                    <strong className="text-2xl text-primary">{line.replace(/#/g, '')}</strong>
                  ) : line}
                </p>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary">Ready to test your knowledge?</h3>
                <p className="text-sm text-primary/70">Generate a quiz based specifically on these notes.</p>
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md group">
                Generate Quiz <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;
