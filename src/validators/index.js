import { getLogger } from '../utils/logger.js';
import { validationResult } from 'express-validator';

const logger = getLogger();

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(`[validators/index/runValidation] errors = ${JSON.stringify(errors)}`);
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  next();
};
