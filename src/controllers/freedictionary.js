import { fetchWord } from '../utils/api.js';

export const getFreeDictionary = async (req, res) => {
  const word = req.params.word;
  console.log(`getFreeDictionary word: ${word}`);

  try {
    const data = await fetchWord(word);
    return res.json({ data });
  } catch (error) {
    console.error(error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: 'Word not found in the dictionary',
      });
    } else {
      return res.status(500).json({ message: 'Server Error' });
    }
  }
};
