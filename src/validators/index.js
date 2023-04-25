import { validationResult } from 'express-validator';

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('VALIDATION ERRORS', errors);
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  next();
};
