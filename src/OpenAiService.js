import axios from 'axios';
// import Bottleneck from 'bottleneck';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  }
});



// const backOff = (retries) => new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));

export const getAIPrioritization = async (prompt) => {
  try {
    const response = await openaiApi.post('/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that prioritizes events." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150
    });
    return response.data;
  } catch (error) {
    console.error('AI prioritization error:', error);
    if (error.response && error.response.data.error.code === "insufficient_quota") {
      console.log("OpenAI quota exceeded. Falling back to default prioritization.");
      return null; // or return a default prioritization
    }
    throw error;
  }
};