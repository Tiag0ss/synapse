import { noteUpdatedAtIso, sameNoteUpdatedAt } from '@/lib/noteConflict';

describe('noteConflict', () => {
  it('normalises Date and ISO strings to second precision', () => {
    const iso = noteUpdatedAtIso('2026-10-17T19:30:45.123Z');
    expect(iso).toBe('2026-10-17T19:30:45.000Z');
    expect(noteUpdatedAtIso(new Date('2026-10-17T19:30:45.999Z'))).toBe(
      '2026-10-17T19:30:45.000Z'
    );
  });

  it('treats matching timestamps as equal across formats', () => {
    expect(
      sameNoteUpdatedAt('2026-10-17T19:30:45.000Z', new Date('2026-10-17T19:30:45.500Z'))
    ).toBe(true);
  });

  it('detects mismatch', () => {
    expect(
      sameNoteUpdatedAt('2026-10-17T19:30:45.000Z', '2026-10-17T19:30:46.000Z')
    ).toBe(false);
  });
});
