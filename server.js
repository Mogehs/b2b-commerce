import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initSocketServer } from "./src/lib/socket.js";
import { validateEnvironment } from "./src/lib/validateEnv.js";

// Validate environment variables on startup
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error.message);
  process.exit(1);
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  initSocketServer(server);

  server.listen(process.env.PORT || 3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${process.env.PORT || 3000}`);
  });
});
