import type { Database } from "@billkill/db";

export interface Session {
  userId: string;
  email: string;
}

export interface Context {
  db: Database;
  session: Session | null;
  redis?: unknown;
}

export function createContext(opts: {
  db: Database;
  session: Session | null;
  redis?: unknown;
}): Context {
  return {
    db: opts.db,
    session: opts.session,
    redis: opts.redis,
  };
}
