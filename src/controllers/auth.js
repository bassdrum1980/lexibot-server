import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

// export const signUp = (req, res) => {
//   const { name, email, password } = req.body;

//   // Check if user exists in our database
//   User.findOne({ email: email })
//     .then((user) => {
//       if (user) {
//         return res.status(400).json({
//           error: 'Email is taken',
//         });
//       } else {
//         const newUser = new User({ name, email, password });
//         newUser
//           .save()
//           .then(() => {
//             res.json({
//               message: 'Signup success! Please signin.',
//             });
//           })
//           .catch((error) => {
//             console.log('SIGNUP ERROR', error);
//             return res.status(400).json({
//               error,
//             });
//           });
//       }
//     })
//     .catch((error) => console.log(error));
// };

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          error: 'Email is taken',
        });
      }

      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '20m',
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account activation link',
        html: `
          <h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/activate/</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
          `,
      };

      mail.send(emailData).then((sent) => {
        console.log('SIGNUP EMAIL SENT', sent);
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
        });
      });
    })
    .catch((error) => console.log(error));
};
