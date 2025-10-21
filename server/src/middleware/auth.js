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
  const startTime = Date.now();
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

    console.log('[AUTH] Starting token verification...');
    const verifyStart = Date.now();

    // Verify the JWT token with Clerk
    // Note: In Clerk SDK v4, we use verifyToken to verify the JWT
    const payload = await clerkClient.verifyToken(token);

    const verifyTime = Date.now() - verifyStart;
    console.log(`[AUTH] Token verification completed in ${verifyTime}ms`);

    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Attach user ID to request (sub is the user ID in JWT)
    req.userId = payload.sub;
    req.tokenPayload = payload;

    const totalTime = Date.now() - startTime;
    console.log(`[AUTH] Total auth middleware time: ${totalTime}ms for user ${payload.sub}`);

    next();
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[AUTH] Authentication error after ${totalTime}ms:`, error.message);
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
    req.userEmail = user.emailAddresses?.[0]?.emailAddress || null;

    next();
  } catch (error) {
    console.error('Error fetching user info:', error);
    // Don't fail the request, just continue without user info
    next();
  }
}

export default { requireAuth, getUserInfo };
