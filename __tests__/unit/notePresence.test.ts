import { pickSoftLock, type NotePresencePeer } from '../../server/services/notePresence';

describe('pickSoftLock', () => {
  const now = Date.parse('2026-10-18T12:00:00.000Z');

  function peer(partial: Partial<NotePresencePeer> & Pick<NotePresencePeer, 'userId'>): NotePresencePeer {
    return {
      username: `u${partial.userId}`,
      hasFocus: false,
      lastSeenAt: new Date(now).toISOString(),
      ...partial,
    };
  }

  it('returns null when only self is present', () => {
    expect(pickSoftLock([peer({ userId: 1, hasFocus: true })], 1, now)).toBeNull();
  });

  it('picks the most recently focused other user', () => {
    const a = peer({
      userId: 2,
      username: 'Ana',
      hasFocus: true,
      lastSeenAt: new Date(now - 20_000).toISOString(),
    });
    const b = peer({
      userId: 3,
      username: 'Bruno',
      hasFocus: true,
      lastSeenAt: new Date(now - 5_000).toISOString(),
    });
    expect(pickSoftLock([a, b], 1, now)?.username).toBe('Bruno');
  });

  it('ignores peers without focus and expired heartbeats', () => {
    const viewing = peer({ userId: 2, hasFocus: false });
    const stale = peer({
      userId: 3,
      hasFocus: true,
      lastSeenAt: new Date(now - 60_000).toISOString(),
    });
    expect(pickSoftLock([viewing, stale], 1, now)).toBeNull();
  });
});
