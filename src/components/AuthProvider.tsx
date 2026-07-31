"use client";

import { createContext, useContext, type ReactNode } from "react";

/** The only user data that ever reaches the browser. No tokens, ever. */
export interface AuthUser {
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface AuthState {
  /** True only when AUTH_SECRET plus at least one provider are configured. */
  configured: boolean;
  /** Apple is scaffolded but off until the Apple Developer account exists. */
  appleEnabled: boolean;
  user: AuthUser | null;
}

/**
 * The default is the degraded state, and it is the value every consumer sees
 * when the provider is absent. That is what lets the root layout skip
 * mounting this entirely when auth is unconfigured: the sign-in UI simply
 * never renders and the app is byte-for-byte what it was before.
 */
const DEGRADED: AuthState = { configured: false, appleEnabled: false, user: null };

const AuthContext = createContext<AuthState>(DEGRADED);

export function useAuthState(): AuthState {
  return useContext(AuthContext);
}

/** "Kathryn Henderson" -> "Kathryn"; falls back to the email local part. */
export function firstNameOf(user: AuthUser): string {
  const fromName = user.name?.trim().split(/\s+/)[0];
  if (fromName) return fromName;
  const fromEmail = user.email?.split("@")[0];
  return fromEmail && fromEmail.length > 0 ? fromEmail : "You";
}

export default function AuthProvider({
  value,
  children,
}: {
  value: AuthState;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
