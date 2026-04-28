import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { prisma } from "./common/lib/prisma";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./common/config/swagger.config";

import apiRoutes from "./routes";
import { bootstrap } from "./common/utils/bootstrap";

const app = express();
const port = process.env.PORT || 5000;

// Swagger Documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(compression()); // Gzip compression
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
  contentSecurityPolicy: false,     // Disable CSP for local dev if needed, or refine it
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);
app.use("/images", (req, res, next) => {
  // Alias for top-level image access
  next();
}, apiRoutes); // This is a bit hacky, better to just mount the image router specifically

import imageRouter from "./modules/image/image.router";
app.use("/images", imageRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

import { BlogWorker } from "./modules/blog/blog.worker";

// Start the server
async function startServer() {
  try {
    // Startup initialization
    await bootstrap();
    
    // Initialize Workers
    BlogWorker.init();

    const server = app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });

    // Error handling for server
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
      }
    });

    // Graceful shutdown
    const gracefullyShutdown = async (signal: string) => {
      console.log(`\nStopping server due to ${signal}...`);
      server.close(async () => {
        console.log("HTTP server closed.");
        try {
          await prisma.$disconnect();
          console.log("Database connection closed.");
          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });

      // Force close after 10s
      setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefullyShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefullyShutdown("SIGTERM"));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
