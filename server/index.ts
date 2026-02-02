import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
function setSecurityHeaders(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS filter
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Restrict referrer information
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (basic)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  next();
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function rateLimit(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per window per IP

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const record = rateLimiter.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimiter.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  record.count++;
  next();
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Check if static path exists
  if (!fs.existsSync(staticPath)) {
    throw new Error(`Static files directory not found: ${staticPath}`);
  }

  // Apply security middleware
  app.use(setSecurityHeaders);

  // Apply rate limiting to non-static routes
  app.use("/api", rateLimit);

  // Body parsing with size limit
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  // Serve static files
  app.use(express.static(staticPath));

  // Error handling middleware
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      // Don't expose internal error details in production
      const isDevelopment = process.env.NODE_ENV !== "production";
      res.status(500).json({
        error: "Internal Server Error",
        message: isDevelopment ? err.message : "An error occurred",
      });
    }
  );

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");

    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      res
        .status(404)
        .send("Application not found. Please build the client first.");
      return;
    }

    try {
      res.sendFile(indexPath);
    } catch (error) {
      res.status(500).send("Error loading application");
    }
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Handle server errors
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use`);
    } else {
      console.error("Server error:", error);
    }
    process.exit(1);
  });
}

startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
