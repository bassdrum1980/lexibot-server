import prisma from '../db.js';
import jwt from 'jsonwebtoken';
import mail from '@sendgrid/mail';
import {
  makeSalt,
  encryptPassword,
  comparePasswords,
  encryptPasswordWithPublicKey,
  decryptPasswordWithPrivateKey,
} from '../utils/auth.js';
import { getLogger } from '../utils/logger.js';

// Set up logger
const logger = getLogger();

// Set up SendGrid
mail.setApiKey(process.env.SENDGRID_API_KEY);

export const signUp = async (req, res) => {
  const { firstName, email, password } = req.body;

  // Check if user exists
  const userExists = await prisma.user.count({
    where: { email },
  });

  if (userExists) {
    return res.status(400).json({
      error: 'Email is taken',
    });
  }

  // Generate a jwt-token with user name, email and password
  const encryptedPassword = encryptPasswordWithPublicKey(password);
  if (!encryptedPassword) {
    logger.error(
      '[controllers/auth/signUp] ' +
      'Error occured while encrypting password with public key: ' +
      `firstName = ${firstName}, email = ${email}`
    );
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }

  const token = jwt.sign(
    { firstName, email, password: encryptedPassword },
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
        <p>
          <a href="${process.env.CLIENT_URL}/activate/${token}/">${process.env.CLIENT_URL}/activate/${token}/</a>
        </p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
  };

  // Send email
  try {
    await mail.send(emailData);

    return res.json({
      message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
    });
  } catch (error) {
    logger.error(
      '[controllers/auth/signUp] ' +
      'Signup email sent error' +
      `firstName = ${firstName}, email = ${email}, error = ${error.message}`
    );

    return res.json({
      message: error.message,
    });
  }
};

export const activateAccount = (req, res) => {
  const { token } = req.body;

  // If token is not provided
  if (!token) {
    logger.error(
      '[controllers/auth/activateAccount] ' +
      'No token provided in account activation'
    );
    return res.status(400).json({
      message: 'Something went wrong. Try again.',
    });
  }

  // If token is provided
  // Verify the token
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    async (error, decoded) => {
      // If token is expired
      if (error) {
        logger.error(
          '[controllers/auth/activateAccount] ' +
          'JWT verify in account activation error: ' +
          `error = ${error.message}`
        );

        return res.status(401).json({
          error: 'Expired link.',
        });
      }

      // If token is ok
      // Get user info from token
      const { firstName, email, password: encryptedPassword } = decoded;

      const password = decryptPasswordWithPrivateKey(encryptedPassword);
      if (!password) {
        logger.error(
          '[controllers/auth/activateAccount] ' +
          'Error occured while decrypting password with private key: ' +
          `firstName = ${firstName}, email = ${email}, error = ${error.message}`
        );
        return res.status(500).json({
          error: 'Something went wrong',
        });
      }

      // Save user in database
      try {
        const salt = makeSalt();
        const hash = encryptPassword(password, salt);

        const user = await prisma.user.create({
          data: {
            name: firstName,
            email,
            salt,
            hash,
          },
        });

        logger.info(
          '[controllers/auth/activateAccount] ' +
          'Save user in account activation success: ' +
          user
        );

        return res.json({
          message: 'Signup success. Please signin.',
        });
      } catch (error) {
        logger.error(
          '[controllers/auth/activateAccount] ' +
          'Save user in account activation error: ' +
          error
        );

        return res.status(500).json({
          message: 'Server Error',
        });
      }
    }
  );
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
  } catch (error) {
    // Any other error, return error
    logger.error(
      '[controllers/auth/signIn] ' +
      'Sign in error: ' +
      `email = ${email}, error = ${error.message}`
    );

    return res.status(500).json({
      message: 'Server Error',
    });
  }
};
