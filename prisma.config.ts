import { defineConfig } from "@prisma/cli";

export default defineConfig({
  generator: {
    name: "client",
    provider: "prisma-client-js",
    output: "./src/generated/prisma",
    binaryTargets: ["native", "rhel-openssl-3.0.x"],
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
