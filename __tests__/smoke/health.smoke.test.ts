import express from 'express';
import request from 'supertest';
import { buildHealthPayload, registerHealthRoute } from '../../server/health';

describe('smoke: health', () => {
  it('buildHealthPayload returns expected shape', () => {
    const body = buildHealthPayload(new Date('2026-01-01T00:00:00.000Z'));
    expect(body.status).toBe('healthy');
    expect(body.service).toBe('synapse');
    expect(body.timestamp).toBe('2026-01-01T00:00:00.000Z');
    expect(body.myelin).toEqual(
      expect.objectContaining({
        ok: expect.any(Number),
        fail: expect.any(Number),
      })
    );
    expect(body.myelin.lastErrorAt === null || typeof body.myelin.lastErrorAt === 'string').toBe(
      true
    );
  });

  it('GET /health returns 200 JSON with myelin counters', async () => {
    const app = express();
    registerHealthRoute(app);
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('synapse');
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body.myelin).toEqual(
      expect.objectContaining({
        ok: expect.any(Number),
        fail: expect.any(Number),
      })
    );
  });
});
