import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // If the user exists, return an error
      if (user) {
        return res.status(400).json({
          error: 'Email is taken',
        });
      }

      // Generate a jwt-token with user name, email and password
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '20m',
        }
      );

      // Compose an email
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account activation link',
        html: `
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
      };

      // Send the email
      mail
        .send(emailData)
        .then((sent) => {
          console.log('SIGNUP EMAIL SENT', sent);
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
          });
        })
        .catch((error) => {
          console.log('SIGNUP EMAIL SENT ERROR', error);
          return res.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const activateAccount = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (error, decoded) => {
      if (error) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', error);
        return res.status(401).json({
          error: 'Expired link. Signup again.',
        });
      }

      const { name, email, password } = jwt.decode(token);
      const user = new User({ name, email, password });
      user
        .save()
        .then((user) => {
          console.log('SAVE USER IN ACCOUNT ACTIVATION SUCCESS', user);
          return res.json({
            message: 'Signup success. Please signin.',
          });
        })
        .catch((error) => {
          console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', error);
          return res.status(401).json({
            error: 'Error saving user in database. Try signup again.',
          });
        });
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again.',
    });
  }
};

export const signIn = (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  User.findOne({ email })
    .then((user) => {
      // authenticate
      // if wrong password, return error
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: 'Email and password do not match.',
        });
      }

      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // send user info and token to client
      const { _id, name, email, role } = user;
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: "User doesn't exist. Please signup.",
      });
    });
};
