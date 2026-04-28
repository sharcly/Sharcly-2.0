"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../common/lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("./email.service");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "24h";
class AuthService {
    static async generateTokens(userId, roleSlug) {
        const accessToken = jsonwebtoken_1.default.sign({ id: userId, role: roleSlug.toLowerCase() }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken }
        });
        return { accessToken, refreshToken };
    }
    static async register(registerData) {
        const { email, password, name } = registerData;
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const userRole = await prisma_1.prisma.role.findUnique({ where: { slug: "user" } });
        if (!userRole) {
            throw new Error("Default user role not found. Please run seed script.");
        }
        const user = await prisma_1.prisma.$transaction(async (tx) => {
            return await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    roleId: userRole.id,
                    verificationToken
                },
                include: { role: true }
            });
        });
        // Send verification email
        try {
            await (0, email_service_1.sendVerificationEmail)(email, verificationToken);
        }
        catch (emailError) {
            console.error("Failed to send verification email:", emailError);
        }
        const roleSlug = user.role?.slug || "user";
        const tokens = await this.generateTokens(user.id, roleSlug);
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: roleSlug,
            }
        };
    }
    static async verifyEmail(token) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { verificationToken: token }
        });
        if (!user) {
            throw new Error("Invalid or expired token");
        }
        return await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true, verificationToken: null }
        });
    }
    static async login(loginData) {
        const { email, password } = loginData;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        if (user.isBlocked) {
            throw new Error("Your account is blocked");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        const roleSlug = user.role?.slug || "user";
        const tokens = await this.generateTokens(user.id, roleSlug);
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: roleSlug,
            }
        };
    }
    static async refreshTokens(refreshToken) {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        }
        catch (err) {
            throw new Error("Invalid refresh token");
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.id },
            include: { role: true }
        });
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token or user not found");
        }
        const roleSlug = user.role?.slug || "user";
        return await this.generateTokens(user.id, roleSlug);
    }
    static async logout(userId) {
        return await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    }
    static async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: true,
                role: true
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;
        return userWithoutSensitiveData;
    }
}
exports.AuthService = AuthService;
