import { globSync } from "fs";
import path from "path";

import type { Serverless, Functions } from "serverless/aws";

const apiPrefix = "/api/greetings";
const handlersDir = "src/handlers";

export const slugify = (...args: string[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

const loadHandlers = (): Functions => {
  const dirPath = path.resolve(__dirname, handlersDir);

  const handlerFiles = globSync(`${handlersDir}/**/*.ts`).map((file) =>
    file.replace(`${handlersDir}/`, ""),
  );

  const handlers: Functions = {};

  handlerFiles.forEach((file) => {
    const fileName = file.replace(".ts", "");
    const fullPath = path.join(dirPath, file);
    const module = require(fullPath);
    const handler = module.default;

    if (!handler) {
      throw new Error(
        `Handler file "${handlersDir}/${file}" must export a default handler function. Example: export default async function handler(event) { ... }`,
      );
    }

    const event = module.event;

    if (!event) {
      throw new Error(
        `Handler file "${handlersDir}/${file}" must export an "event" (object or array). Example: export const event = { httpApi: { path: "/foo", method: "get" } };`,
      );
    }

    if (fileName in handlers) {
      throw new Error(
        `Duplicate handler filename "${fileName}" found in "${handlersDir}/${file}". Each handler must have a unique name.`,
      );
    }

    const slug = slugify(fileName);

    handlers[slug] = {
      handler: `${handlersDir}/${fileName}.default`,
      events: [
        {
          ...event,
          ...(event.httpApi && {
            httpApi: {
              ...event.httpApi,
              path: apiPrefix + event.httpApi.path,
            },
          }),
        },
      ],
    };
  });

  return handlers;
};

const configuration: Serverless = {
  org: "eduardovdev",
  service: "my-first-sls-app",
  frameworkVersion: "4",
  provider: {
    httpApi: {
      cors: true,
    },
    name: "aws",
    region: "us-east-1",
    runtime: "nodejs22.x",
    stage: "${opt:stage, 'dev'}",
    environment: {
      PORT: "${env:PORT, 3005}",
      ENV: "${env:ENV, 'Development'}",
    },
  },
  custom: {
    "serverless-offline": {
      httpPort: "${env:PORT, 3005}",
    },
  },
  functions: loadHandlers(),
  plugins: ["serverless-offline"],
};

module.exports = configuration;
