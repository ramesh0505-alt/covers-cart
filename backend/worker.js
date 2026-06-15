import serverless from 'serverless-http';
import app from './server.js';

export default {
  async fetch(request, env, ctx) {
    // Populate process.env with Cloudflare env vars
    if (typeof process === 'undefined') {
      globalThis.process = { env: {} };
    }
    Object.assign(process.env, env);

    // Provide Prisma a mocked NEXT_RUNTIME env var if needed by Prisma Edge
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'dataproxy';

    const handler = serverless(app);
    return handler(request, ctx);
  }
};
