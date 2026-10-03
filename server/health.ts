import type { Express, Request, Response } from 'express';
import { getMyelinHealthCounters } from './services/pmClient';

export type HealthPayload = {
  status: 'healthy';
  service: 'synapse';
  timestamp: string;
  myelin: {
    ok: number;
    fail: number;
    lastErrorAt: string | null;
  };
};

export function buildHealthPayload(now: Date = new Date()): HealthPayload {
  return {
    status: 'healthy',
    service: 'synapse',
    timestamp: now.toISOString(),
    myelin: getMyelinHealthCounters(),
  };
}

export function registerHealthRoute(app: Express): void {
  app.get('/health', (_req: Request, res: Response) => {
    res.json(buildHealthPayload());
  });
}
