# 🧠 AI Study Buddy

AI Study Buddy is an AI-powered, full-stack learning platform designed to help students master new concepts efficiently. It combines the power of local LLMs (Ollama) and cloud AI (Groq) to provide personalized learning experiences.

## ✨ Features

- **📊 Personal Dashboard:** Track your performance, view your accuracy over time, and see what topics you study the most.
- **📚 Notes Generator:** Enter any topic to instantly generate structured, markdown-formatted study notes.
- **🎯 Quiz Hub:** Test your knowledge with dynamically generated multiple-choice questions based on your study topics or existing notes.
- **💬 Chat Tutor:** Ask questions and get context-aware answers. The tutor can read your saved notes to provide personalized help.
- **🎬 YouTube Explainer:** Paste a YouTube video link to get an instant, AI-generated summary of the educational content.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts, React Router
- **Backend:** Node.js, Express
- **Database:** SQLite
- **AI Infrastructure:** 
  - **Local Development:** Ollama (Llama 3)
  - **Cloud Production:** Groq Platform (Llama 3.3)

---

## 🚀 Getting Started (Local Setup)

To run the AI Study Buddy locally, you need to open **three separate terminal tabs**.

### Prerequisites
- Node.js installed
- [Ollama](https://ollama.com/download) installed and running

### 1. Start the AI Model (Tab 1)
```bash
ollama run llama3
```
*Leave this running in the background.*

### 2. Start the Backend (Tab 2)
```bash
cd server
npm install
node index.js
```
*The server will start on port 5001 and automatically create the SQLite database.*

### 3. Start the Frontend (Tab 3)
```bash
cd client
npm install
npm run dev
```
*The frontend will start on port 3000.*

Open [http://localhost:3000](http://localhost:3000) in your browser and start learning!

---

## ☁️ Deployment

This project is configured to run easily in the cloud.

1. **AI Setup:** Get a free API key from [Groq](https://console.groq.com/).
2. **Backend (Render):** Deploy the `server` directory as a Web Service on Render. Set `GROQ_API_KEY` in your environment variables. Add a persistent disk at `/var/data` and set `DATABASE_PATH=/var/data/database.sqlite`.
3. **Frontend (Vercel):** Deploy the `client` directory on Vercel. Set the `VITE_API_BASE_URL` environment variable to your Render backend URL.
