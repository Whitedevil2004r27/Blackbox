import 'dotenv/config';
import { buildServer } from './server';

const PORT = parseInt(process.env.API_PORT || '4000');
const HOST = process.env.API_HOST || '0.0.0.0';

async function main() {
  const server = await buildServer();

  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`FreelanceX API running on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
