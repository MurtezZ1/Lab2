import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/prisma.js";
import { env, validateEnv } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";
import { connectRedis } from "./config/redis.js";
import { initSocket } from "./config/socket.js";

async function start() {
  validateEnv();
  await connectDatabase();
  await connectMongo();
  await connectRedis();

  const server = app.listen(env.port, () => {
    console.log(`Sunspot backend running on http://localhost:${env.port}`);
  });
  initSocket(server);

  const shutdown = async () => {
    await disconnectDatabase();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Backend failed to start:", error);
  process.exit(1);
});
