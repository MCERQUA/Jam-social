import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Clerk with secret key
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is required in environment variables');
}

/**
 * Middleware to verify Clerk session token
 */
export async function requireAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the session token with Clerk
    const session = await clerkClient.sessions.verifySession(token, token);

    if (!session || !session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session'
      });
    }

    // Attach user ID to request
    req.userId = session.userId;
    req.session = session;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: error.message
    });
  }
}

/**
 * Middleware to get user info from Clerk (optional)
 */
export async function getUserInfo(req, res, next) {
  try {
    if (!req.userId) {
      return next();
    }

    const user = await clerkClient.users.getUser(req.userId);
    req.user = user;

    next();
  } catch (error) {
    console.error('Error fetching user info:', error);
    // Don't fail the request, just continue without user info
    next();
  }
}

export default { requireAuth, getUserInfo };
