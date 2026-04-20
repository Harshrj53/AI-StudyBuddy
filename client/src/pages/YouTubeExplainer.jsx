import React, { useState } from 'react';
import { Youtube, Search, Loader2, Sparkles, FileText, ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import * as api from '../services/api';

const YouTubeExplainer = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // For demonstration, we'll extract a title from the URL or just use a generic one
      const title = url.includes('v=') ? `Video ${url.split('v=')[1].substring(0, 6)}` : 'the selected video';
      const data = await api.explainYouTube(url, title);
      setResult(data);
    } catch (err) {
      console.error('Explanation error:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-lg mb-2">
          <Youtube className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">YouTube Explainer</h1>
        <p className="text-muted-foreground text-lg">Paste a video link and get an AI-powered summary and explanation of the core concepts.</p>
      </header>

      <div className="bg-card p-1 p-1 bg-gradient-to-br from-red-500/20 via-primary/20 to-purple-500/20 rounded-xl">
        <div className="bg-card p-8 rounded-[22px] border border-border/50 shadow-xl">
          <form onSubmit={handleExplain} className="flex gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-red-500">
                <Youtube size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
                className="w-full bg-background border border-border rounded-lg pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
              />
            </div>
            <button 
              disabled={!url.trim() || isLoading}
              className="bg-red-600 text-white px-8 py-5 rounded-lg font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg flex items-center gap-3 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-6 w-6" />
                  Explain
                </>
              )}
            </button>
          </form>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
            <p className="font-bold mb-1 uppercase text-[10px] tracking-widest">Connection Error</p>
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-10 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold">AI Explanation</h2>
              </div>
              <div className="prose prose-sm max-w-none text-foreground prose-p:leading-relaxed prose-p:text-base prose-p:mb-6">
                {result.explanation.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="bg-card p-10 rounded-xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-muted-foreground" /> Full Transcript Summary
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {result.transcript}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-muted flex items-center justify-center relative group cursor-pointer">
                <PlayCircle className="absolute h-16 w-16 text-white/80 group-hover:text-red-500 group-hover:scale-110 transition-all z-10" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                <img 
                  src={`https://img.youtube.com/vi/${url.split('v=')[1]?.substring(0,11)}/maxresdefault.jpg`} 
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'; }}
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2 line-clamp-2">{result.title}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-4">Educational Video</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-foreground/80">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Watch full video for deep dive</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary p-8 rounded-xl text-primary-foreground shadow-xl">
              <h4 className="font-bold text-xl mb-4 leading-tight">Want to study these concepts?</h4>
              <p className="text-primary-foreground/80 text-sm mb-6">Convert this summary into structured notes or generate a quiz to test yourself.</p>
              <div className="space-y-3">
                <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all">
                  Generate Study Notes
                </button>
                <button className="w-full bg-primary-foreground/10 border border-primary-foreground/20 text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-foreground/20 transition-all">
                  Start Quick Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeExplainer;
