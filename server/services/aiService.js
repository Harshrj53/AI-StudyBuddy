import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.AI_MODEL || 'llama3';

export const generateAIResponse = async (prompt, systemPrompt = '') => {
  // 1. Try Groq (Cloud) if API Key is provided
  if (GROQ_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq Cloud Error:', error.response?.data || error.message);
      const err = new Error('Cloud AI (Groq) is currently unavailable. Please check your API key and internet connection.');
      err.status = 503;
      err.code = 'AI_CLOUD_OFFLINE';
      throw err;
    }
  }

  // 2. Fallback to Ollama (Local)
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
    });
    return response.data.response;
  } catch (error) {
    console.error('Ollama Local Error:', error.message);
    const err = new Error('Local AI (Ollama) is not running. Please start Ollama on your machine to use this feature.');
    err.status = 503;
    err.code = 'AI_LOCAL_OFFLINE';
    throw err;
  }
};



export const chatWithContext = async (messages, contextNotes = []) => {
  // RAG-lite: Include context notes in the prompt
  const notesContext = contextNotes.length > 0 
    ? `\nRelevant Study Notes:\n${contextNotes.map(n => `- ${n.title}: ${n.content}`).join('\n')}`
    : '';

  const systemPrompt = `You are AI Study Buddy, a helpful and expert tutor. Your goal is to explain concepts clearly, provide examples, and help the student learn effectively.${notesContext}`;
  
  // Convert chat messages to a single prompt format for llama3 (simplified for generation)
  const fullPrompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + '\nAI:';
  
  return await generateAIResponse(fullPrompt, systemPrompt);
};

export const generateStructuredNotes = async (topic) => {
  const systemPrompt = `You are a high-quality educational content generator. Generate structured notes in markdown format. 
  Use headings (# ##), bullet points, and practical examples. 
  Include a "Key Takeaways" section.`;

  const prompt = `Generate comprehensive study notes for the topic: "${topic}". Provide a short summary followed by detailed explanations.`;
  
  return await generateAIResponse(prompt, systemPrompt);
};

export const generateQuiz = async (topic, difficulty = 'medium', noteContent = '') => {
  const systemPrompt = `You are a quiz master. Generate a set of 5 multiple-choice questions (MCQs). 
  Difficulty: ${difficulty}. 
  Format: Return ONLY a JSON array of objects.
  Each object: {"question": "...", "options": ["A", "B", "C", "D"], "answer": "...", "explanation": "..."}`;

  const sourceContext = noteContent ? `based on these notes: "${noteContent}"` : `on the topic of "${topic}"`;
  const prompt = `Generate 5 MCQs ${sourceContext}. Difficulty level is ${difficulty}.`;
  
  const response = await generateAIResponse(prompt, systemPrompt);
  
  // Note: Local models might sometimes wrap JSON in markdown blocks
  try {
    const jsonMatch = response.match(/\[.*\]/s);
    return JSON.parse(jsonMatch ? jsonMatch[0] : response);
  } catch (e) {
    console.warn('Failed to parse quiz JSON, returning raw string', e);
    return response;
  }
};
