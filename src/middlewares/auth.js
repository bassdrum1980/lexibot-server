import jwt from 'jsonwebtoken';
import getLogger from '../utils/logger.js';

// Set up logger
const logger = getLogger();

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ error: 'Not authorized' });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({ error: 'Invalid token' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    logger.error(
      '[middlewares/auth/protect] ' +
        'JWT verify in protect middleware error: ' +
        `error = ${error.message}`
    );

    res.status(401);
    res.json({ error: 'Invalid token' });
    return;
  }
};
