import User from '../models/user.js';

// Get user info
export const getUser = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId)
    .then((user) => {
      // remove sensitive data
      user.hashedPassword = undefined;
      user.salt = undefined;
      return user;
    })
    .catch((error) => {
      console.log('User not found: ', error);
      res.status(400).json({
        error: 'User not found',
      });
    });
  res.json(user);
};
