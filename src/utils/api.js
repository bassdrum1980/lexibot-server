import axios from 'axios';

export const fetchWord = async (word) => {
  try {
    const response = await axios.get(
      `${process.env.FREE_DICTIONARY_API_URL}${word}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
