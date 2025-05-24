
import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(254, 'Email is too long');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// General text input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .slice(0, 1000); // Limit length
};

// Validation for login form
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Helper function to validate and return errors
export const validateField = <T>(schema: z.ZodSchema<T>, value: T) => {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.errors[0]?.message;
};
