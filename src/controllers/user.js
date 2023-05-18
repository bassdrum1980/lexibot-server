import prisma from '../db.js';

export const getUser = async (req, res) => {
  // Get user id from req.user (attached by 'protect' middleware)
  const userId = req.user.id;

  try {
    // Get user from db
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // If no user found, return 400
    if (!user) {
      console.error('USER NOT FOUND IN GET USER');
      return res.status(400).json({
        error: 'User not found',
      });
    }

    // Return user to client
    return res.json(user);
  } catch (error) {
    // All unhandled errors are caught here
    console.error('ERROR IN GET USER: ', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};
