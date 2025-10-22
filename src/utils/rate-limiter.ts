import rateLimit from 'express-rate-limit';

// Login limiter - strict to prevent brute force
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // max 5 attempts per IP
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// Password reset limiter - prevent abuse of reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // max 5 attempts per IP
  message: "Too many password reset attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// Registration limiter - more lenient to allow legitimate signups but prevent bots
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // max 20 attempts per IP
  message: "Too many registration attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// Forgot password limiter - similar to password reset
export const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // max 5 attempts per IP
  message: "Too many password reset requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});