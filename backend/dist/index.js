"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const prisma_1 = require("./common/lib/prisma");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_config_1 = __importDefault(require("./common/config/swagger.config"));
const routes_1 = __importDefault(require("./routes"));
const bootstrap_1 = require("./common/utils/bootstrap");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Swagger Documentation
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_config_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Middleware
app.use((0, compression_1.default)()); // Gzip compression
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api", routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
// Start the server
async function startServer() {
    try {
        // Startup initialization
        await (0, bootstrap_1.bootstrap)();
        const server = app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
        // Error handling for server
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${port} is already in use.`);
                process.exit(1);
            }
            else {
                console.error('❌ Server error:', err);
            }
        });
        // Graceful shutdown
        const gracefullyShutdown = async (signal) => {
            console.log(`\nStopping server due to ${signal}...`);
            server.close(async () => {
                console.log("HTTP server closed.");
                try {
                    await prisma_1.prisma.$disconnect();
                    console.log("Database connection closed.");
                    process.exit(0);
                }
                catch (err) {
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
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
