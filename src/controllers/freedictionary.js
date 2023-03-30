export const getFreeDictionary = async (req, res) => {
  console.log(`getFreeDictionary req.params.word: ${req.params.word}`);
  return res.json({ data: req.params.word });
  // try {
  //   const freeDictionary = await FreeDictionary.find();
  //   res.json(freeDictionary);
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send('Server Error');
  // }
};
