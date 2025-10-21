/**
 * Admin authentication middleware
 * Checks if the authenticated user has admin privileges
 */

// Admin user IDs or emails (can be moved to env vars)
const ADMIN_USERS = [
  'mike@koolfoam.com',
  // Add more admin emails here
];

export function requireAdmin(req, res, next) {
  // User must be authenticated first (requireAuth should run before this)
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // Check if user email is in admin list
  // Note: We'll need to get user info from Clerk
  // For now, we'll use a simple check
  const userEmail = req.userEmail;

  if (!userEmail || !ADMIN_USERS.includes(userEmail.toLowerCase())) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  next();
}

export function checkAdminEmail(email) {
  return ADMIN_USERS.includes(email?.toLowerCase());
}
