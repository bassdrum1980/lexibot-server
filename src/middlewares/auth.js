import { expressjwt } from 'express-jwt';

// checking if the user's token is issued by us and isn't expired
export const validateJwt = expressjwt({
  secret: process.env.JWT_SECRET, // => req.auth._id
  algorithms: ['HS256'],
});
