import React, { useState } from 'react';
import { 
  Plus, 
  GraduationCap, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  Trophy,
  RefreshCcw,
  Clock
} from 'lucide-react';
import { cn } from '../utils/cn';
import * as api from '../services/api';

const QuizHub = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.generateQuiz(topic, difficulty);
      setQuiz(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    if (option === quiz.questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      submitResults();
    }
  };

  const submitResults = async () => {
    try {
      await api.submitQuizResult(quiz.id, score + (selectedAnswer === quiz.questions[currentQuestionIndex].answer ? 1 : 0), quiz.questions.length);
    } catch (err) {
      console.error('Failed to submit results:', err);
    }
  };

  if (isFinished) {
    const finalScore = score;
    const total = quiz.questions.length;
    const percentage = Math.round((finalScore / total) * 100);

    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto h-full text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Trophy className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Quiz Complete!</h1>
        <p className="text-muted-foreground text-lg mb-8">Great job on finishing the quiz on <span className="font-bold text-foreground">{topic}</span>.</p>
        
        <div className="grid grid-cols-2 gap-6 w-full mb-12">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase">Your Score</p>
            <h2 className="text-4xl font-bold text-primary">{finalScore} / {total}</h2>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase">Accuracy</p>
            <h2 className="text-4xl font-bold text-green-500">{percentage}%</h2>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button 
            onClick={() => { setQuiz(null); setIsFinished(false); setTopic(''); }}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            Back to Hub
          </button>
          <button 
            onClick={startQuiz}
            className="flex-1 bg-secondary text-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all active:scale-95"
          >
            <RefreshCcw size={18} /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quiz) {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{topic} • {difficulty}</p>
              <h1 className="font-bold">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-xs font-bold text-muted-foreground uppercase">Progress</p>
               <p className="text-sm font-bold">{Math.round(progress)}%</p>
             </div>
             <div className="w-32 bg-muted h-2 rounded-full overflow-hidden">
               <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>

        <div className="bg-card p-10 rounded-xl border border-border shadow-sm space-y-8">
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "p-5 rounded-lg border-2 text-left font-medium transition-all flex justify-between items-center group",
                  selectedAnswer === null 
                    ? "border-border hover:border-primary hover:bg-primary/5" 
                    : option === currentQuestion.answer
                      ? "border-green-500 bg-green-50 text-green-700"
                      : option === selectedAnswer
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-border opacity-50"
                )}
              >
                <span>{option}</span>
                {selectedAnswer !== null && option === currentQuestion.answer && <CheckCircle2 size={24} />}
                {selectedAnswer === option && option !== currentQuestion.answer && <XCircle size={24} />}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-secondary/50 rounded-lg border border-border animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase text-xs tracking-widest">
                <Sparkles size={14} /> Explanation
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">
                {currentQuestion.explanation || "No explanation provided for this question."}
              </p>
            </div>
          )}

          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="w-full bg-foreground text-background py-5 rounded-lg font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl animate-in slide-in-from-bottom-2 duration-300"
            >
              {currentQuestionIndex + 1 === quiz.questions.length ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Quiz Hub</h1>
        <p className="text-muted-foreground mt-1">Master any subject with AI-generated practice questions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-10 rounded-xl border border-border shadow-sm flex flex-col justify-center h-[500px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-primary h-6 w-6" /> Generate a New Quiz
            </h2>
            <p className="text-muted-foreground">Type a topic and select difficulty. Our AI will craft 5 custom MCQs for you.</p>
          </div>

          <form onSubmit={startQuiz} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase opacity-70">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Physics, History, Biology..."
                className="w-full bg-background border border-border rounded-lg px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase opacity-70">Difficulty</label>
              <div className="flex gap-4">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "flex-1 py-3 rounded-xl border font-bold capitalize transition-all",
                      difficulty === d ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!topic.trim() || isLoading}
              className="w-full bg-primary text-primary-foreground py-5 rounded-lg font-bold text-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </form>
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
              <p className="font-bold mb-1 uppercase text-[10px] tracking-widest">Connection Error</p>
              {error}
            </div>
          )}
        </div>

        <div className="bg-secondary/30 rounded-xl border border-border p-10 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Quiz History</h3>
          <p className="text-muted-foreground mb-8">View your past performance and track your growth over time.</p>
          <div className="w-full bg-card rounded-lg p-6 border border-border opacity-50 flex items-center justify-center italic text-sm text-muted-foreground h-32">
            No quiz results yet. Generate your first quiz to see stats here!
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHub;
