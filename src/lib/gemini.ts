import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const generateQuiz = async (topic: string, difficulty: string, numQuestions: number = 5) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with exactly ${numQuestions} multiple choice questions. 
    Format the response as JSON with the following structure:
    {
      "title": "Quiz Title",
      "topic": "${topic}",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "id": 1,
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation"
        }
      ]
    }
    Only return valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const quizData = JSON.parse(text);
    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

export const generateSolution = async (question: string, userAnswer: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Given this question: "${question}" and the user's answer: "${userAnswer}", 
    provide a detailed explanation and solution. If the answer is wrong, explain the correct approach.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating solution:', error);
    throw error;
  }
};

export const generateStudyTips = async (topic: string, difficulty: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Generate ${difficulty} level study tips and tricks for "${topic}". 
    Include important concepts, common mistakes to avoid, and practice strategies. Keep it concise and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating study tips:', error);
    throw error;
  }
};
