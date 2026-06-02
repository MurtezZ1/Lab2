import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "prisma:seed", "--prefix", "backend"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 0);
