// Type stub for VS Code resolution in the CLI workspace.
// In the generated project these types come from the base template (src/types/auth.type.ts).
// This file is NOT copied into generated projects by the scaffolder.

export type UserRole = "superadmin" | "admin" | "user";
export type JwtUserPayload = { id: string; role: UserRole };
export type CreateUserInput = { name: string; email: string; passwordHash: string; role: UserRole };
export type UpdateUserInput = Partial<{
  name: string; email: string; passwordHash: string;
  photoUrl: string; role: UserRole; locale: string; isActive: boolean;
}>;
