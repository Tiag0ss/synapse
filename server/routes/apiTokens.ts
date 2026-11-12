import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticateSession, AuthRequest } from '../middleware/auth';
import {
  createApiToken,
  deleteApiToken,
  listApiTokensForUser,
  revokeApiToken,
} from '../services/apiTokens';
import logger from '../utils/logger';

const router = Router();

router.use(authenticateSession);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tokens = await listApiTokensForUser(req.user!.userId);
    res.json({ success: true, data: tokens });
  } catch (error) {
    logger.error('List API tokens failed', { error, userId: req.user?.userId });
    res.status(500).json({ success: false, message: 'Failed to list API tokens' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = z
    .object({
      tokenName: z.string().min(1).max(255),
      expiresAt: z.string().datetime().nullable().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'tokenName is required' });
  }
  try {
    const expiresAt =
      parsed.data.expiresAt != null && parsed.data.expiresAt !== ''
        ? new Date(parsed.data.expiresAt)
        : null;
    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid expiresAt' });
    }
    const created = await createApiToken({
      userId: req.user!.userId,
      tokenName: parsed.data.tokenName,
      expiresAt,
    });
    res.status(201).json({
      success: true,
      data: {
        ...created.row,
        rawToken: created.rawToken,
      },
      message: 'API token created. Save it now — it will not be shown again.',
    });
  } catch (error) {
    logger.error('Create API token failed', { error, userId: req.user?.userId });
    res.status(500).json({ success: false, message: 'Failed to create API token' });
  }
});

router.patch('/:id/revoke', async (req: AuthRequest, res: Response) => {
  const tokenId = Number(req.params.id);
  if (!Number.isFinite(tokenId) || tokenId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid token id' });
  }
  try {
    const ok = await revokeApiToken(req.user!.userId, tokenId);
    if (!ok) return res.status(404).json({ success: false, message: 'Token not found' });
    res.json({ success: true, message: 'Token revoked' });
  } catch (error) {
    logger.error('Revoke API token failed', { error, userId: req.user?.userId, tokenId });
    res.status(500).json({ success: false, message: 'Failed to revoke API token' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const tokenId = Number(req.params.id);
  if (!Number.isFinite(tokenId) || tokenId <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid token id' });
  }
  try {
    const ok = await deleteApiToken(req.user!.userId, tokenId);
    if (!ok) return res.status(404).json({ success: false, message: 'Token not found' });
    res.json({ success: true, message: 'Token deleted' });
  } catch (error) {
    logger.error('Delete API token failed', { error, userId: req.user?.userId, tokenId });
    res.status(500).json({ success: false, message: 'Failed to delete API token' });
  }
});

export default router;
