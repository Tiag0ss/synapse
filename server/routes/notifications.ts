import { Router, Response } from 'express';
import { authenticateSession, AuthRequest } from '../middleware/auth';
import {
  countUnreadNotifications,
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications';
import logger from '../utils/logger';

const router = Router();

router.use(authenticateSession);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const unreadOnly = String(req.query.unread || '') === '1';
    const [items, unreadCount] = await Promise.all([
      listNotificationsForUser(userId, { unreadOnly, limit: 40 }),
      countUnreadNotifications(userId),
    ]);
    res.json({ success: true, data: { items, unreadCount } });
  } catch (error) {
    logger.error('GET notifications failed', { error });
    res.status(500).json({ success: false, message: 'Failed to load notifications' });
  }
});

router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const unreadCount = await countUnreadNotifications(req.user!.userId);
    res.json({ success: true, data: { unreadCount } });
  } catch (error) {
    logger.error('GET notifications/unread-count failed', { error });
    res.status(500).json({ success: false, message: 'Failed to load unread count' });
  }
});

router.post('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await markAllNotificationsRead(req.user!.userId);
    res.json({ success: true, data: { updated } });
  } catch (error) {
    logger.error('POST notifications/read-all failed', { error });
    res.status(500).json({ success: false, message: 'Failed to mark notifications read' });
  }
});

router.post('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }
    const ok = await markNotificationRead(req.user!.userId, id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('POST notifications/:id/read failed', { error });
    res.status(500).json({ success: false, message: 'Failed to mark notification read' });
  }
});

export default router;
