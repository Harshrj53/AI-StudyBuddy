import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import * as api from '../services/api';

const ChatTutor = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Study Buddy. What are we learning today? You can ask me to explain a concept, solve a problem, or summarize your notes." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useNotesContext, setUseNotesContext] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage([...messages, userMsg], useNotesContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please make sure Ollama is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Chat Tutor</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Powered by Llama 3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-xl border border-border">
          <button 
            onClick={() => setUseNotesContext(!useNotesContext)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              useNotesContext ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Study Notes Context: {useNotesContext ? 'ON' : 'OFF'}
          </button>
          <div className="group relative">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-popover text-popover-foreground rounded-lg shadow-xl border border-border text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              When ON, the AI will use your saved study notes to provide personalized answers.
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-4 max-w-3xl",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
          )}>
            <div className={cn(
              "h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center shadow-sm",
              msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card border border-border text-primary"
            )}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={cn(
              "p-4 rounded-lg shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-card border border-border rounded-tl-none text-foreground prose prose-sm max-w-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mr-auto">
            <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-primary animate-pulse">
              <Bot size={20} />
            </div>
            <div className="p-4 rounded-lg bg-card border border-border rounded-tl-none flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <footer className="p-6 bg-background">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here (e.g. 'Explain quantum entanglement')..."
            className="w-full bg-card border border-border rounded-lg py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:shadow-md"
          />
          <button 
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Always double-check AI responses. Study Buddy can occasionally make mistakes.
        </p>
      </footer>
    </div>
  );
};

export default ChatTutor;
