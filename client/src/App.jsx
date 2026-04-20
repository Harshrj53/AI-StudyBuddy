import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChatTutor from './pages/ChatTutor.jsx';
import NotesGenerator from './pages/NotesGenerator.jsx';
import QuizHub from './pages/QuizHub.jsx';
import YouTubeExplainer from './pages/YouTubeExplainer.jsx';
import Library from './pages/Library.jsx';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background font-['Inter',sans-serif]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatTutor />} />
            <Route path="/notes" element={<NotesGenerator />} />
            <Route path="/quiz" element={<QuizHub />} />
            <Route path="/youtube" element={<YouTubeExplainer />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
