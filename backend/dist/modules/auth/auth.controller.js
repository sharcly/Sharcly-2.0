"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refreshTokens = exports.login = exports.verifyEmail = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await auth_service_1.AuthService.register({ email, password, name });
        res.status(201).json({
            success: true,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            user: result.user,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message || "Registration failed" });
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token)
            return res.status(400).json({ message: "Token is required" });
        await auth_service_1.AuthService.verifyEmail(token);
        res.status(200).json({ success: true, message: "Email verified successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message || "Verification failed" });
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.AuthService.login({ email, password });
        res.status(200).json({
            success: true,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            user: result.user,
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Login failed" });
    }
};
exports.login = login;
const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const tokens = await auth_service_1.AuthService.refreshTokens(refreshToken);
        res.status(200).json({
            success: true,
            ...tokens
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Token refresh failed" });
    }
};
exports.refreshTokens = refreshTokens;
const logout = async (req, res) => {
    try {
        await auth_service_1.AuthService.logout(req.user.id);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Logout failed" });
    }
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const user = await auth_service_1.AuthService.getProfile(req.user.id);
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(404).json({ message: error.message || "Failed to get profile" });
    }
};
exports.getProfile = getProfile;
