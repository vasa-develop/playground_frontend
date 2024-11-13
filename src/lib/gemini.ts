import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY || '');

// Create a client for text generation
export async function generateText(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Create a client for chat
export async function chatWithModel(messages: { role: 'user' | 'assistant'; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chat = model.startChat();

    // Process all messages in the chat history
    for (const message of messages) {
      if (message.role === 'user') {
        await chat.sendMessage(message.content);
      }
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    const result = await chat.sendMessage(lastUserMessage.content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}
