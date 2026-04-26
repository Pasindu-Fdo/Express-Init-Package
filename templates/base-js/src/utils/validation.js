import { ValidationError } from "./errors.js";

const DEFAULT_PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export function validateEmail(email) {
  if (!email || typeof email !== "string") throw new ValidationError("Email is required");
  const trimmed = email.trim();
  if (trimmed.length === 0) throw new ValidationError("Email cannot be empty");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) throw new ValidationError("Invalid email format");
}

export function validatePassword(password, requirements = DEFAULT_PASSWORD_REQUIREMENTS) {
  if (!password || typeof password !== "string") throw new ValidationError("Password is required");
  if (password.length < requirements.minLength)
    throw new ValidationError(`Password must be at least ${requirements.minLength} characters long`);
  if (requirements.requireUppercase && !/[A-Z]/.test(password))
    throw new ValidationError("Password must contain at least one uppercase letter");
  if (requirements.requireLowercase && !/[a-z]/.test(password))
    throw new ValidationError("Password must contain at least one lowercase letter");
  if (requirements.requireNumbers && !/\d/.test(password))
    throw new ValidationError("Password must contain at least one number");
  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    throw new ValidationError("Password must contain at least one special character");
}

export function validateRequiredString(value, fieldName) {
  if (!value || typeof value !== "string") throw new ValidationError(`${fieldName} is required`);
  if (value.trim().length === 0) throw new ValidationError(`${fieldName} cannot be empty`);
}

export function validateRegisterInput(input) {
  if (!input || typeof input !== "object") throw new ValidationError("Invalid input data");
  validateRequiredString(input.name, "Name");
  validateRequiredString(input.email, "Email");
  validateRequiredString(input.password, "Password");
  validateEmail(input.email);
  validatePassword(input.password);
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };
}

export function validateForgotPasswordInput(input) {
  if (!input || typeof input !== "object") throw new ValidationError("Invalid input data");
  validateRequiredString(input.email, "Email");
  validateEmail(input.email);
  return {
    email: input.email.trim().toLowerCase(),
  };
}

export function validateResetPasswordInput(input) {
  if (!input || typeof input !== "object") throw new ValidationError("Invalid input data");
  validateRequiredString(input.token, "Token");
  validateRequiredString(input.newPassword, "New password");
  validateRequiredString(input.confirmPassword, "Confirm password");
  validatePassword(input.newPassword);
  if (input.newPassword !== input.confirmPassword) throw new ValidationError("Passwords do not match");
  return {
    token: input.token,
    newPassword: input.newPassword,
    confirmPassword: input.confirmPassword,
  };
}

export function validateLoginInput(input) {
  if (!input || typeof input !== "object") throw new ValidationError("Invalid input data");
  validateRequiredString(input.email, "Email");
  validateRequiredString(input.password, "Password");
  validateEmail(input.email);
  return {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };
}

export function validateChangePasswordInput(input) {
  if (!input || typeof input !== "object") throw new ValidationError("Invalid input data");
  validateRequiredString(input.oldPassword, "Old password");
  validateRequiredString(input.newPassword, "New password");
  validateRequiredString(input.confirmPassword, "Confirm password");
  validatePassword(input.newPassword);
  if (input.newPassword !== input.confirmPassword) throw new ValidationError("Passwords do not match");
  return {
    oldPassword: input.oldPassword,
    newPassword: input.newPassword,
    confirmPassword: input.confirmPassword,
  };
}
