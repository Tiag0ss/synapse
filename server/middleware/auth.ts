import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool, RowDataPacket } from '../config/database';
import { jwtSecret } from '../services/secrets';
import {
  resolveUserIdFromApiToken,
  SYNAPSE_API_TOKEN_PREFIX,
} from '../services/apiTokens';

export interface SynapseUser {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  sessionVersion: number;
}

export interface AuthRequest extends Request {
  user?: SynapseUser;
}

export function signSession(user: SynapseUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      sv: user.sessionVersion ?? 0,
    },
    jwtSecret(),
    { expiresIn: '7d' }
  );
}

type DecodedSession = {
  userId?: number;
  pmUserId?: number;
  username?: string;
  email?: string;
  isAdmin?: boolean;
  sv?: number;
};

function bearerFromRequest(req: AuthRequest): string {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

function tryDecodeJwt(token: string): DecodedSession | null {
  if (!token || token.startsWith(SYNAPSE_API_TOKEN_PREFIX)) return null;
  try {
    return jwt.verify(token, jwtSecret()) as DecodedSession;
  } catch {
    return null;
  }
}

async function loadActiveUserById(
  userId: number,
  opts?: { requireSessionVersion?: number | null; fallbackUsername?: string; fallbackEmail?: string }
): Promise<SynapseUser | null> {
  if (!Number.isFinite(userId) || userId <= 0) return null;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Username, Email, IsAdmin, IsActive, SessionVersion FROM Users WHERE Id = ?`,
    [userId]
  );
  if (!rows.length || Number(rows[0].IsActive) !== 1) return null;

  const sessionVersion = Number(rows[0].SessionVersion ?? 0);
  if (opts?.requireSessionVersion != null && opts.requireSessionVersion !== sessionVersion) {
    return null;
  }

  return {
    userId,
    username: String(rows[0].Username || opts?.fallbackUsername || ''),
    email: String(rows[0].Email || opts?.fallbackEmail || ''),
    isAdmin: Number(rows[0].IsAdmin) === 1,
    sessionVersion,
  };
}

async function resolveAuthUser(req: AuthRequest): Promise<SynapseUser | null> {
  const bearer = bearerFromRequest(req);
  const cookieToken =
    (req as AuthRequest & { cookies?: Record<string, string> }).cookies?.synapse_session || '';

  if (bearer.startsWith(SYNAPSE_API_TOKEN_PREFIX)) {
    const resolved = await resolveUserIdFromApiToken(bearer);
    if (!resolved) return null;
    return loadActiveUserById(resolved.userId);
  }

  const decoded = tryDecodeJwt(bearer || cookieToken);
  if (!decoded) return null;
  const userId = Number(decoded.userId ?? decoded.pmUserId);
  return loadActiveUserById(userId, {
    requireSessionVersion: Number(decoded.sv ?? 0),
    fallbackUsername: decoded.username,
    fallbackEmail: decoded.email,
  });
}

export async function authenticateSession(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await resolveAuthUser(req);
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(500).json({ success: false, message: 'Authentication check failed' });
  }
}

/** Attach session user when present; continue without error if missing/invalid. */
export async function optionalAuthenticateSession(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    req.user = (await resolveAuthUser(req)) || undefined;
    next();
  } catch {
    next();
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT IsAdmin, IsActive, SessionVersion FROM Users WHERE Id = ?',
      [req.user.userId]
    );
    if (!rows.length || Number(rows[0].IsActive) !== 1) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (Number(rows[0].SessionVersion ?? 0) !== Number(req.user.sessionVersion ?? 0)) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (Number(rows[0].IsAdmin) !== 1) {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }
    req.user.isAdmin = true;
    next();
  } catch {
    res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
}
