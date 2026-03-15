export type UserRole = "superadmin" | "admin" | "user";

export type JwtUserPayload = {
  id: string;
  role: UserRole;
};

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  passwordHash: string;
  photoUrl: string;
  role: UserRole;
  locale: string;
  isActive: boolean;
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
