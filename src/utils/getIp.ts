import { Request } from 'express';

export function getIp(req: Request): string | undefined {
  const ip =
    req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || req.ip;

  return Array.isArray(ip) ? ip[0] : ip;
}
