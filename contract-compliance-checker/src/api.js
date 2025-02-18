import axios from "axios";

const API_URL = "http://localhost:8000/analyze";

export const analyzeContract = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.results;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
