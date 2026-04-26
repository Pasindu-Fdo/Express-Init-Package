export type UserRole = "superadmin" | "admin" | "user";

export type JwtUserPayload = {
  id: string;
  role: UserRole;
};

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  passwordHash: string;
  photoUrl: string;
  role: UserRole;
  locale: string;
  isActive: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}>;

/**
 * Password strength validation configuration
 */
export type PasswordRequirements = {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
};

/**
 * Registration input
 */
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

/**
 * Forgot password input
 */
export type ForgotPasswordInput = {
  email: string;
};

/**
 * Reset password input
 */
export type ResetPasswordInput = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Login input
 */
export type LoginInput = {
  email: string;
  password: string;
};

/**
 * Change password input
 */
export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
