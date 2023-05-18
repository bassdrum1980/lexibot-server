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

    // If no user found, return error
    if (!user) {
      console.error('User not found: ', error);
      return res.status(400).json({
        error: 'User not found',
      });
    }

    // Return user to client
    return res.json(user);
  } catch (e) {
    // All unhandled errors are caught here
    console.error('ERROR IN GETTING USER', e);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
