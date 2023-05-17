import prisma from '../db.js';
import jwt from 'jsonwebtoken';
import mail from '@sendgrid/mail';
import { makeSalt, encryptPassword, comparePasswords } from '../utils/auth.js';

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const signUp = async (req, res) => {
  const { firstName, email, password } = req.body;

  // If the user exists, return an error
  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(400).json({
      error: 'Email is taken',
    });
  }

  // Generate a jwt-token with user name, email and password
  const token = jwt.sign(
    { firstName, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: '1d',
    }
  );

  // Compose an email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Account activation link',
    html: `
        <h1>Please use the following link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/activate/${token}/</p>
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
};

export const activateAccount = (req, res) => {
  const { token } = req.body;

  // If token is provided
  if (token) {
    // Verify the token
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      async (error, decoded) => {
        // If token is expired
        if (error) {
          console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', error);
          return res.status(401).json({
            error: 'Expired link.',
          });
        }

        // If token is ok
        // Get user info from token
        const { firstName, email, password } = decoded;

        // Save user in database
        try {
          const salt = makeSalt();
          const user = await prisma.user.create({
            data: {
              name: firstName,
              email,
              salt,
              hash: encryptPassword(password, salt),
            },
          });
          console.log('SAVE USER IN ACCOUNT ACTIVATION SUCCESS', user);

          return res.json({
            message: 'Signup success. Please signin.',
          });
        } catch (e) {
          console.error('SAVE USER IN ACCOUNT ACTIVATION ERROR', e);

          return res.status(500).json({
            message: 'Server Error',
          });
        }
      }
    );
  } else {
    // If token is not provided
    console.log('NO TOKEN PROVIDED IN ACCOUNT ACTIVATION');

    return res.status(400).json({
      message: 'Something went wrong. Try again.',
    });
  }
};

export const signIn = async (req, res) => {
  // Get user info from request body
  const { email, password } = req.body;

  try {
    // Find user in database
    const user = await prisma.user.findUnique({ where: { email } });

    // If user not found, return error
    if (!user) {
      return res.status(400).json({
        error: 'User Not Found',
      });
    }

    // If wrong password, return error
    if (!comparePasswords(password, user.hash, user.salt)) {
      return res.status(400).json({
        error: 'Invalid Credentials',
      });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    // Send user info and token to client
    return res.json({
      token,
      user: { id: user.id, firstName: user.name, email: user.email },
    });
  } catch (e) {
    // Any other error, return error
    console.error('SIGN IN ERROR', e);

    return res.status(500).json({
      message: 'Server Error',
    });
  }
};
