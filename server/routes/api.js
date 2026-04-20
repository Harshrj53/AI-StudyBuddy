import express from 'express';
import { db } from '../db.js';
import * as aiService from '../services/aiService.js';

const router = express.Router();

// --- CHAT TUTOR ---
router.post('/chat', async (req, res) => {
  const { messages, useNotesContext } = req.body;
  try {
    let contextNotes = [];
    if (useNotesContext) {
      // Simple RAG: fetch most recent notes
      contextNotes = await new Promise((resolve) => {
        db.all("SELECT title, content FROM notes ORDER BY created_at DESC LIMIT 3", [], (err, rows) => {
          resolve(rows || []);
        });
      });
    }

    const response = await aiService.chatWithContext(messages, contextNotes);
    res.json({ response });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.code || 'SERVER_ERROR', 
      message: error.message 
    });
  }
});

// --- NOTES ---
router.post('/notes/generate', async (req, res) => {
  const { topic } = req.body;
  try {
    const content = await aiService.generateStructuredNotes(topic);
    
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO notes (title, topic, content) VALUES (?, ?, ?)",
        [topic, topic, content],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.json({ title: topic, topic, content });

  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.code || 'SERVER_ERROR', 
      message: error.message 
    });
  }
});

router.get('/notes', (req, res) => {
  db.all("SELECT * FROM notes ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.delete('/notes/:id', (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- QUIZZES ---
router.post('/quizzes/generate', async (req, res) => {
  const { topic, difficulty, noteId } = req.body;
  try {
    let noteContent = '';
    if (noteId) {
      noteContent = await new Promise((resolve) => {
        db.get("SELECT content FROM notes WHERE id = ?", [noteId], (err, row) => {
          resolve(row ? row.content : '');
        });
      });
    }

    const questions = await aiService.generateQuiz(topic, difficulty, noteContent);
    const questionsJson = JSON.stringify(questions);

    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO quizzes (title, topic, difficulty, questions) VALUES (?, ?, ?, ?)",
        [`Quiz on ${topic}`, topic, difficulty, questionsJson],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.json({ title: `Quiz on ${topic}`, topic, difficulty, questions });

  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.code || 'SERVER_ERROR', 
      message: error.message 
    });
  }
});

router.post('/quizzes/submit', (req, res) => {
  const { quiz_id, score, total } = req.body;
  const accuracy = (score / total) * 100;

  db.run(
    "INSERT INTO performance (quiz_id, score, total, accuracy) VALUES (?, ?, ?, ?)",
    [quiz_id, score, total, accuracy],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, performance_id: this.lastID });
    }
  );
});

// --- ANALYTICS ---
router.get('/analytics', (req, res) => {
  const stats = {};
  db.all("SELECT accuracy, created_at FROM performance ORDER BY created_at ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.performanceHistory = rows;
    
    db.all("SELECT topic, COUNT(*) as count FROM notes GROUP BY topic", [], (err, topicRows) => {
      stats.topicsStudied = topicRows;
      res.json(stats);
    });
  });
});

// --- YOUTUBE (SIMULATED) ---
router.post('/youtube/explain', async (req, res) => {
  const { url, title } = req.body;
  try {
    // Simmons transcript logic
    const topic = title || "the video content";
    const transcriptSim = `This is a simulated transcript for the video about ${topic}. The video discusses key aspects, components, and practical applications of ${topic}. It covers the fundamental principles and modern implementations.`;
    
    const explanation = await aiService.generateAIResponse(
      `Based on this transcript snippet: "${transcriptSim}", explain the core concepts clearly to a student.`,
      "You are an expert at summarizing educational videos."
    );

    res.json({ title: topic, explanation, transcript: transcriptSim });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.code || 'SERVER_ERROR', 
      message: error.message 
    });
  }
});

export default router;
