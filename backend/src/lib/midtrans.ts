// @ts-ignore - midtrans-client doesn't have type definitions
import midtransClient from 'midtrans-client';

/**
 * Shared Midtrans Snap client configured via MIDTRANS_IS_PRODUCTION so
 * sandbox deployments on Vercel (where NODE_ENV=production) stay in sandbox
 * unless explicitly switched to production.
 */
export const snap = new (midtransClient as any).Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey:
    process.env.MIDTRANS_CLIENT_KEY ||
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
    '',
});
