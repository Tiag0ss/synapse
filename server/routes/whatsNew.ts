import { Router, Response } from 'express';
import { authenticateSession, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { normalizeVersion } from '../services/changelogFilter';
import {
  buildWhatsNewEntries,
  getCurrentAppVersion,
  getUserLastSeenAppVersion,
  setUserLastSeenAppVersion,
} from '../services/whatsNew';

const router = Router();

router.use(authenticateSession);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const fullRaw = String(req.query.full ?? '').toLowerCase();
    const full = fullRaw === '1' || fullRaw === 'true';
    const sinceQuery = normalizeVersion(
      typeof req.query.since === 'string' ? req.query.since : null
    );

    const lastSeenAppVersion = await getUserLastSeenAppVersion(userId);
    const currentVersion = getCurrentAppVersion();
    const entries = buildWhatsNewEntries(full, lastSeenAppVersion, sinceQuery);

    return res.json({
      success: true,
      data: {
        currentVersion,
        lastSeenAppVersion,
        entries,
      },
    });
  } catch (error) {
    logger.error('Error fetching What’s New changelog', { error });
    return res.status(500).json({ success: false, message: 'Failed to load What’s New' });
  }
});

router.patch('/seen', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const currentVersion = getCurrentAppVersion();
    await setUserLastSeenAppVersion(userId, currentVersion);

    return res.json({
      success: true,
      data: { lastSeenAppVersion: currentVersion },
      message: 'What’s New acknowledged',
    });
  } catch (error) {
    logger.error('Error marking What’s New as seen', { error });
    return res.status(500).json({ success: false, message: 'Failed to update seen version' });
  }
});

export default router;
