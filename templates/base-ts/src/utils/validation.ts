import { ValidationError } from "./errors.js";
import type {
  PasswordRequirements,
  ForgotPasswordInput,
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "../types/auth.type.js";

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Validates email format
 */
export function validateEmail(email: string): void {
  if (!email || typeof email !== "string") {
    throw new ValidationError("Email is required");
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) {
    throw new ValidationError("Email cannot be empty");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new ValidationError("Invalid email format");
  }
}

/**
 * Validates password strength
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
): void {
  if (!password || typeof password !== "string") {
    throw new ValidationError("Password is required");
  }

  if (password.length < requirements.minLength) {
    throw new ValidationError(
      `Password must be at least ${requirements.minLength} characters long`,
    );
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    throw new ValidationError("Password must contain at least one uppercase letter");
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    throw new ValidationError("Password must contain at least one lowercase letter");
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    throw new ValidationError("Password must contain at least one number");
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    throw new ValidationError("Password must contain at least one special character");
  }
}

/**
 * Validates required string field
 */
export function validateRequiredString(value: unknown, fieldName: string): void {
  if (!value || typeof value !== "string") {
    throw new ValidationError(`${fieldName} is required`);
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }
}

/**
 * Validates registration input
 */
export function validateRegisterInput(input: unknown): RegisterInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Invalid input data");
  }

  const data = input as Record<string, unknown>;

  validateRequiredString(data.name, "Name");
  validateRequiredString(data.email, "Email");
  validateRequiredString(data.password, "Password");

  validateEmail(data.email as string);
  validatePassword(data.password as string);

  return {
    name: (data.name as string).trim(),
    email: (data.email as string).trim().toLowerCase(),
    password: data.password as string,
  };
}

/**
 * Validates forgot password input
 */
export function validateForgotPasswordInput(input: unknown): ForgotPasswordInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Invalid input data");
  }

  const data = input as Record<string, unknown>;

  validateRequiredString(data.email, "Email");
  validateEmail(data.email as string);

  return {
    email: (data.email as string).trim().toLowerCase(),
  };
}

/**
 * Validates reset password input
 */
export function validateResetPasswordInput(input: unknown): ResetPasswordInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Invalid input data");
  }

  const data = input as Record<string, unknown>;

  validateRequiredString(data.token, "Token");
  validateRequiredString(data.newPassword, "New password");
  validateRequiredString(data.confirmPassword, "Confirm password");

  validatePassword(data.newPassword as string);

  if (data.newPassword !== data.confirmPassword) {
    throw new ValidationError("Passwords do not match");
  }

  return {
    token: data.token as string,
    newPassword: data.newPassword as string,
    confirmPassword: data.confirmPassword as string,
  };
}

/**
 * Validates login input
 */
export function validateLoginInput(input: unknown): LoginInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Invalid input data");
  }

  const data = input as Record<string, unknown>;

  validateRequiredString(data.email, "Email");
  validateRequiredString(data.password, "Password");

  validateEmail(data.email as string);

  return {
    email: (data.email as string).trim().toLowerCase(),
    password: data.password as string,
  };
}

/**
 * Validates change password input
 */
export function validateChangePasswordInput(input: unknown): ChangePasswordInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Invalid input data");
  }

  const data = input as Record<string, unknown>;

  validateRequiredString(data.oldPassword, "Old password");
  validateRequiredString(data.newPassword, "New password");
  validateRequiredString(data.confirmPassword, "Confirm password");

  validatePassword(data.newPassword as string);

  if (data.newPassword !== data.confirmPassword) {
    throw new ValidationError("Passwords do not match");
  }

  return {
    oldPassword: data.oldPassword as string,
    newPassword: data.newPassword as string,
    confirmPassword: data.confirmPassword as string,
  };
}
