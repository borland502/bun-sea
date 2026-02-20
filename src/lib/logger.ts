/**
 * Lightweight console-based logger that mirrors Winston's core API surface.
 * Methods are stored as reassignable properties to support test mocking.
 *
 * Set `LOG_LEVEL` env var to control verbosity:
 *   "debug" | "info" (default) | "warn" | "error"
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getLevel(): number {
  const env = (Bun.env.LOG_LEVEL ?? "info").toLowerCase() as LogLevel;
  return LOG_LEVELS[env] ?? LOG_LEVELS.info;
}

export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export const logger: Logger = {
  debug: (message: string) => {
    if (getLevel() <= LOG_LEVELS.debug) console.debug(message);
  },
  info: (message: string) => {
    if (getLevel() <= LOG_LEVELS.info) console.info(message);
  },
  warn: (message: string) => {
    if (getLevel() <= LOG_LEVELS.warn) console.warn(message);
  },
  error: (message: string) => {
    if (getLevel() <= LOG_LEVELS.error) console.error(message);
  },
};
