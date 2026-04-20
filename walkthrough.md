# 🚦 3-Tab Startup Checklist

To use the AI Study Buddy locally, you need **three things** running at the same time. Open three separate terminal tabs and follow this:

| Tab | Service | Command | Purpose |
| :--- | :--- | :--- | :--- |
| **Tab 1** | **Ollama** | `ollama run llama3` | The AI "Brain" |
| **Tab 2** | **Backend** | `cd server && node index.js` | The Database & Logic |
| **Tab 3** | **Frontend** | `cd client && npm run dev` | The User Interface |

> [!IMPORTANT]
> **Keep all three windows open!** If you close the Backend or Ollama, the app will show connection errors.

---

# Walkthrough: AI Study Buddy Completion & Deployment

The "AI Study Buddy" platform is now fully implemented, debugged, and prepared for high-quality deployment. This project transforms local LLM capabilities into a production-ready study platform.

## 🚀 Deployment Guide

I have updated the code to be "Cloud Ready" with a Hybrid AI approach. Follow these steps to put your app online:

### 1. Cloud AI Setup (Groq)
Since Ollama is local, the cloud version needs an API. 
- Go to [console.groq.com](https://console.groq.com) and get a free API key.
- The code in `aiService.js` is already updated to use this key automatically if provided.

### 2. Backend Deployment (Render.com)
- Create a new **Web Service**.
- **Build Command**: `cd server && npm install`
- **Start Command**: `node index.js`
- **Environment Variables**:
  - `GROQ_API_KEY`: Paste your key here.
  - `DATABASE_PATH`: Set to `/var/data/database.sqlite`.
- **Advanced**: Add a **Persistent Disk** mounted at `/var/data`.

### 3. Frontend Deployment (Vercel.com)
- Connect your GitHub repository.
- Vercel will auto-detect the Vite project.
- **Environment Variables**:
  - `VITE_API_BASE_URL`: The URL of your Render backend.

---

## 🛠️ Features Implemented

### 📊 Intelligence & Analytics
- **Hybrid AI Service**: Seamlessly switches between local Ollama and Groq Cloud.
- **Personalized Dashboard**: Real-time performance tracking with beautiful charts (`recharts`).

### 📚 Study Tools
- **Chat Tutor**: Context-aware AI chat that can "read" your saved notes.
- **Notes Generator**: Creates structured Markdown notes on any topic.
- **Quiz Hub**: Dynamic MCQ generation with difficulty levels and instant feedback.
- **YouTube Explainer**: Summarizes educational videos from a simple URL.

### 🗄️ Knowledge Management
- **Study Library**: Persistent storage for all generated notes with search and preview.
- **Production Database**: Refactored to `db.js` to ensure data persistence and stability in the cloud.

---

## ✅ Verification
- [x] **Backend Stability**: Resolved circular dependencies and refactored DB calls to eliminate 500 errors.
- [x] **Frontend Polish**: Integrated Tailwind Typography and responsive layouts.
- [x] **Cloud Compatible**: Verified build succeeds for production.
