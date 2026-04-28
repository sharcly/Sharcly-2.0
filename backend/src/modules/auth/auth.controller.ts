import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const result = await AuthService.register({ email, password, name });
    
    res.status(201).json({
      success: true,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required" });

    await AuthService.verifyEmail(token as string);
    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Verification failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    res.status(200).json({
      success: true,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Login failed" });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const tokens = await AuthService.refreshTokens(refreshToken);
    res.status(200).json({
      success: true,
      ...tokens
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Token refresh failed" });
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    await AuthService.logout(req.user.id);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Logout failed" });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Failed to get profile" });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    await AuthService.changePassword(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Password update failed" });
  }
};
