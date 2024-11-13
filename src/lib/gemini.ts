import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize the Gemini API with the API key
const API_KEY = 'AIzaSyB5lS12pKCWQ_ZoiR13eAQ9_o0-QABUBtQ';  // Temporary hardcoded key
const genAI = new GoogleGenerativeAI(API_KEY);

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
    console.log('Chat messages received:', messages);
    console.log('Using API key:', API_KEY ? 'Present' : 'Missing');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('Model initialized');

    const chat = model.startChat();
    console.log('Chat started');

    const lastUserMessage = messages[messages.length - 1];
    console.log('Last user message:', lastUserMessage);

    if (lastUserMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    console.log('Sending message to API:', lastUserMessage.content);
    try {
      const result = await chat.sendMessage(lastUserMessage.content);
      console.log('Received result from API');
      const response = await result.response;
      console.log('Processed response:', response.text());
      return response.text();
    } catch (error: any) {
      console.error('Error in API call:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      throw new Error(`Failed to get response from Gemini API: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}

export async function analyzeImage(imageFile: File, prompt: string) {
  try {
    console.log('Starting image analysis with prompt:', prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    console.log('Model initialized for image analysis');

    // Convert File to base64
    const imageData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        resolve(base64Data.split(',')[1]);
      };
      reader.readAsDataURL(imageFile);
    });

    // Prepare image parts for the API
    const imageParts = [
      {
        inlineData: {
          data: imageData,
          mimeType: imageFile.type
        }
      }
    ];

    console.log('Sending request to Gemini API');
    const result = await model.generateContent([prompt, ...imageParts]);
    console.log('Received response from Gemini API');
    const response = await result.response;
    console.log('Analysis response:', response.text());
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export async function generateCode(prompt: string) {
  try {
    console.log('Starting code generation with prompt:', prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('Model initialized for code generation');
    const enhancedPrompt = `Generate code for the following request. Please provide clear, well-commented code with explanations: ${prompt}`;
    console.log('Enhanced prompt:', enhancedPrompt);
    const result = await model.generateContent(enhancedPrompt);
    console.log('Received result from API');
    const response = await result.response;
    console.log('Generated code response:', response.text());
    return response.text();
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}
