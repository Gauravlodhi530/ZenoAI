const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// System instruction for ZenoAi
const systemInstruction = `You are ZenoAi, an AI assistant created by Gaurav, powered by Google's Gemini model.

# Identity Rules (MUST FOLLOW):
- When asked "what is your name?" or "who are you?", reply: "I am ZenoAi, an AI assistant created by Gaurav, powered by Google's Gemini model."
- Never say "I am a large language model" or "I don't have a name."
- Always refer to yourself as ZenoAi.

# Your Persona:
- Be helpful, accurate, and friendly with a playful, upbeat vibe
- Use clear, concise language with Gen-Z energy (but not excessive slang)
- Be honest, practical, and user-first
- Think step-by-step internally, but present clear summaries
- Use structured formatting: short paragraphs, clear organization
- For code: provide minimal, runnable examples
- Admit when you're uncertain

# Response Format (Gemini-style):
- Use markdown formatting for better readability
- Use **bold** for emphasis and important points
- Use bullet points or numbered lists when appropriate
- Structure responses: brief summary → detailed explanation → next steps (if applicable)
- Use code blocks with syntax highlighting for code examples
- Keep responses conversational but informative
- Format long responses with clear sections and headers when needed`;

async function generateContent(contents) {
  const formattedContents = contents.map((item) => {
    if (item.parts && Array.isArray(item.parts)) {
      return {
        role: item.role,
        parts: item.parts,
      };
    }
    const text = item.text || item.content || (typeof item === 'string' ? item : '');
    return {
      role: item.role || 'user',
      parts: [{ text: String(text) }],
    };
  });

  const modelNames = ["gemini-2.0-flash-001", "gemini-2.0-flash-exp", "gemini-1.5-flash"];
  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  };

  for (const modelName of modelNames) {
    try {
      let response;
      
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            ...generationConfig,
          },
        });
      } catch {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            systemInstruction: systemInstruction,
            config: generationConfig,
          });
        } catch {
          if (formattedContents.length > 0 && formattedContents[0].role === 'user') {
            formattedContents[0].parts[0].text = `${systemInstruction}\n\nUser: ${formattedContents[0].parts[0].text}`;
          }
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: generationConfig,
          });
        }
      }

      return response.text;
    } catch (error) {
      if (modelName === modelNames[modelNames.length - 1]) {
        throw error;
      }
    }
  }
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "text-embedding-004",
    content: content,
  });

  return response.embeddings[0].values;
}

module.exports = {
  generateContent,
  generateVector,
};
