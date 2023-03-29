export const signUp = (req, res) => {
  console.log('req.body on signup', req.body);
  res.json({
    data: 'signup endpoint',
  });
};
