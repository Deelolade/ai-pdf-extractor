"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.logOutUser = exports.signInUser = exports.createUser = exports.getUserData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const errorHandler_1 = require("../utils/errorHandler");
const sendEmail_1 = require("../utils/sendEmail");
const getUserData = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await user_model_1.User.findById(req.user?.id).select('-password').select('-passwordHistory');
        console.log(user);
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Failed to fetch user "));
    }
};
exports.getUserData = getUserData;
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next((0, errorHandler_1.errorHandler)(400, "All fields are required !!"));
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return next((0, errorHandler_1.errorHandler)(400, "User already existed !"));
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await user_model_1.User.create({
            name,
            email,
            password: hashedPassword,
            ispaidUser: false,
            trialCount: 0,
            plan: user_model_1.userPlan.FREE
        });
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id,
            email: newUser.email,
        }, env_1.JWT_TOKEN, { expiresIn: "7d" });
        await (0, sendEmail_1.sendEmail)(newUser.email, "Welcome to DocFeel 🚀", `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hi ${newUser.name || "there"},</h2>
    <p>Welcome to <strong>AI PDF Extractor</strong> — your intelligent assistant for reading, analyzing, and extracting insights from PDFs in seconds.</p>
    <p>Here’s what you can do right away:</p>
    <ul>
      <li>📄 Upload any PDF document</li>
      <li>💡 Ask questions and get instant AI-powered answers</li>
      <li>📊 Summarize reports and research papers effortlessly</li>
    </ul>
    <p>We’re excited to help you save time and focus on what truly matters.</p>
    <br/>
    <p>— The DocFeel Team</p>
    <hr/>
    <small style="color:#777;">If you didn’t sign up for this account, please ignore this email.</small>
  </div>
  `);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                plan: newUser.plan,
                isPaidUser: newUser.isPaidUser,
                trialCount: newUser.trialCount,
                subscriptionEndDate: newUser.subscriptionEndDate,
            },
            token,
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Error occured while saving user to database"));
    }
};
exports.createUser = createUser;
const signInUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next((0, errorHandler_1.errorHandler)(400, "All fields are required !!"));
    }
    try {
        const validUser = await user_model_1.User.findOne({ email });
        if (!validUser) {
            return next((0, errorHandler_1.errorHandler)(400, "User not found"));
        }
        const validPassword = bcryptjs_1.default.compareSync(password, validUser.password);
        if (!validPassword) {
            return next((0, errorHandler_1.errorHandler)(400, "Invalid Credentials"));
        }
        const token = jsonwebtoken_1.default.sign({ id: validUser._id, email: validUser.email }, env_1.JWT_TOKEN, { expiresIn: "7d" });
        await (0, sendEmail_1.sendEmail)(validUser.email, "New sign-in to your DocFeel account", `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello ${validUser.name || "there"},</h2>
    <p>We noticed a new login to your <strong>DocFeel</strong> account.</p>
    <p>If this was you, you can safely ignore this email.</p>
    <p>If it wasn’t you, we recommend resetting your password immediately to protect your data.</p>
    <br/>
    <p>Stay secure,</p>
    <p>— The DocFeel Security Team</p>
    <hr/>
    <small style="color:#777;">This is an automated email. Please do not reply.</small>
  </div>
  `);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });
        res.status(200).json({
            success: true,
            message: "Signed in successfully",
            user: {
                id: validUser._id,
                name: validUser.name,
                email: validUser.email,
                plan: validUser.plan,
                isPaidUser: validUser.isPaidUser,
                trialCount: validUser.trialCount,
                subscriptionEndDate: validUser.subscriptionEndDate,
            },
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Error occured while signing in"));
    }
};
exports.signInUser = signInUser;
const logOutUser = async (req, res, next) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Error occured while logging out"));
    }
};
exports.logOutUser = logOutUser;
const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await user_model_1.User.findOne({ email });
        if (!existingUser) {
            res.status(200).json({
                success: true,
                message: "If this email exists, a reset link has been sent.",
            });
            return;
        }
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        existingUser.passwordResetTokenHash = hashedToken;
        existingUser.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 100);
        await existingUser.save();
        const resetPasswordLink = `${env_1.FRONTEND_URL}/reset-password?token=${rawToken}`;
        await (0, sendEmail_1.sendEmail)(existingUser.email, "Attempt to change password on your account 🔐", `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2>Hello ${existingUser.name || "there"},</h2>
  <p>We received a request to reset the password for your <strong> DocFeel </strong> account.</p>
  <p>If you made this request, you can reset your password by clicking the link below:</p>
  <p><a href="${resetPasswordLink}" style="color: #007bff; text-decoration: none;">Reset Your Password</a></p>
  <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
  <br/>
  <p>Stay secure,</p>
  <p>— DocFeel Security Team</p>
  <hr/>
  <small style="color:#777;">This is an automated email. Please do not reply.</small>
</div>
  `);
        res.status(200).json({
            success: true,
            message: "If this email exists, a reset link has been sent.",
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Error occured while changing user password"));
    }
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;
        if (!token || !newPassword) {
            return next((0, errorHandler_1.errorHandler)(400, "Token and new password are required"));
        }
        const tokenHash = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const existingUser = await user_model_1.User.findOne({
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { $gt: new Date() }
        });
        if (!existingUser) {
            return next((0, errorHandler_1.errorHandler)(400, "This password reset link is invalid."));
        }
        if (newPassword) {
            if (!newPassword) {
                return next((0, errorHandler_1.errorHandler)(400, "Password is required."));
            }
            if (newPassword.length < 8) {
                return next((0, errorHandler_1.errorHandler)(400, "Password must be at least 8 characters long."));
            }
            if (!/[a-z]/.test(newPassword)) {
                return next((0, errorHandler_1.errorHandler)(400, "Password must contain at least one lowercase letter."));
            }
            if (!/[A-Z]/.test(newPassword)) {
                return next((0, errorHandler_1.errorHandler)(400, "Password must contain at least one uppercase letter."));
            }
            if (!/\d/.test(newPassword)) {
                return next((0, errorHandler_1.errorHandler)(400, "Password must include a number."));
            }
            if (!/[\W_]/.test(newPassword)) {
                return next((0, errorHandler_1.errorHandler)(400, "Password must include a special character."));
            }
        }
        if (existingUser.passwordHistory) {
            for (const p of existingUser.passwordHistory) {
                const isSame = await bcryptjs_1.default.compare(newPassword, p.hash);
                if (isSame) {
                    return next((0, errorHandler_1.errorHandler)(400, "You can not reuse a recent password."));
                }
            }
        }
        if (!existingUser.passwordHistory) {
            existingUser.passwordHistory = [];
        }
        existingUser.passwordHistory.unshift({
            hash: existingUser.password,
            changedAt: new Date()
        });
        // Limit to last 3–5 passwords
        existingUser.passwordHistory = existingUser.passwordHistory.slice(0, 5);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        existingUser.passwordResetExpiresAt = undefined;
        existingUser.passwordResetTokenHash = undefined;
        existingUser.passwordChangedAt = new Date();
        await Promise.all([
            existingUser.save(),
            (0, sendEmail_1.sendEmail)(existingUser.email, "Your password was changed ✅", `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello ${existingUser.name || "there"},</h2>
    <p>This is a confirmation that the password for your <strong>DocFeel</strong> account was successfully changed.</p>
    <p>If you made this change, no further action is needed.</p>
    <p>If you did <strong>not</strong> change your password, please <a href="https://docfeel.vercel.app/forgot-password" style="color: #007bff; text-decoration: none;">secure your account</a> immediately by resetting your password and reviewing your account activity.</p>
    <br/>
    <p>Stay safe,</p>
    <p>— DocFeel Security Team</p>
    <hr/>
    <small style="color:#777;">This is an automated email. Please do not reply.</small>
  </div>
  `)
        ]);
        res.status(200).json({ success: true, message: "Password reset successful!" });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Error occured while changing user password"));
    }
};
exports.resetPassword = resetPassword;
