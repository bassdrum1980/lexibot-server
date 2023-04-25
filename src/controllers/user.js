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

// Update user info
export const updateUser = async (req, res) => {
  const { firstName, password } = req.body;
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!firstName) {
        return res.status(400).json({
          error: 'Name is required',
        });
      } else {
        user.firstName = firstName;
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: 'Password should be min 6 characters long',
          });
        } else {
          user.password = password;
        }
      }
      user
        .save()
        .then((updatedUser) => {
          updatedUser.hashedPassword = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
        })
        .catch((error) => {
          console.log('USER UPDATE ERROR', error);
          return res.status(400).json({
            error: 'User update failed',
          });
        });
    })
    .catch((error) => {
      console.log('User not found: ', error);
      res.status(400).json({
        error: 'User not found',
      });
    });
};
