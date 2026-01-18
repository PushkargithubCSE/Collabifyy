import { type Server } from "node:http";
import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";

import { registerRoutes } from "./routes";
import { setupAuth } from "./replitAuth"; // 🔥 MISSING IMPORT (CRITICAL)

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

// Required for cookies behind proxy (Render / Vercel)
app.set("trust proxy", 1);

/**
 * ✅ CORS
 * Dev safe config (strict prod me kar sakte ho)
 */
app.use(
  cors({
    origin: true,          // 🔥 DEV FIX (prevents silent cookie issues)
    credentials: true,
  })
);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

/**
 * Request logging middleware
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  // 🔥 🔥 🔥 THIS WAS THE MAIN BUG
  // Auth + sessions MUST be initialised BEFORE routes
  setupAuth(app);

  // Register API routes
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Custom setup (Vite / dev tooling)
  await setup(app, server);

  // Start server
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    console.log(`Serving on port ${port}`);
  });
}
