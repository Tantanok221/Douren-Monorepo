import { Hono } from 'hono';
import { testClient } from 'hono/testing';
import { initDB } from '@pkg/database/db';
import { getTestDb, TEST_DATABASE_URL } from './setupTestDatabase';
import { router } from '../trpc';
import { trpcServer } from '@hono/trpc-server';
import { trpcArtistRoute } from '../routes/artist';
import { trpcEventRoute } from '../routes/event';
import ArtistRoute from '../routes/artist';
import EventRoute from '../routes/event';
import { BACKEND_BINDING } from '@pkg/env/constant';
import { HonoVariables } from '../index';

export interface TestEnv extends BACKEND_BINDING {
  TEST_DATABASE_URL: string;
}

export function createTestApp() {
  const app = new Hono<{ Bindings: TestEnv; Variables: HonoVariables }>();
  
  // Mock env variables for testing
  app.use('*', async (c, next) => {
    c.env = {
      ...c.env,
      DATABASE_URL: TEST_DATABASE_URL,
      NODE_ENV: 'test',
      basic_auth_token: 'test-token',
      CLOUDFLARE_IMAGE_AUTH_TOKEN: 'test-image-token'
    } as TestEnv;
    await next();
  });
  
  // Database middleware - use test database
  app.use('*', async (c, next) => {
    const db = getTestDb();
    c.set('db', db);
    await next();
  });
  
  // Mount routes
  app.route('/api/artist', ArtistRoute);
  app.route('/api/event', EventRoute);
  
  // Mount tRPC
  const appRouter = router({
    artist: trpcArtistRoute,
    event: trpcEventRoute
  });
  
  app.use(
    '/api/trpc/*',
    trpcServer({
      router: appRouter,
      createContext: (opts) => ({
        db: getTestDb(),
        env: {
          DATABASE_URL: TEST_DATABASE_URL,
          NODE_ENV: 'test',
          basic_auth_token: 'test-token',
          CLOUDFLARE_IMAGE_AUTH_TOKEN: 'test-image-token'
        } as TestEnv,
        honoContext: opts.c
      })
    })
  );
  
  return app;
}

export function createTestClient() {
  const app = createTestApp();
  return testClient(app);
}

export const mockTrpcContext = () => ({
  db: getTestDb(),
  env: {
    DATABASE_URL: TEST_DATABASE_URL,
    NODE_ENV: 'test',
    basic_auth_token: 'test-token',
    CLOUDFLARE_IMAGE_AUTH_TOKEN: 'test-image-token'
  } as TestEnv,
  honoContext: {} as any
});