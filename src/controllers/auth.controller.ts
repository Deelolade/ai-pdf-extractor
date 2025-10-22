import chalk from "chalk";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, JWT_TOKEN } from "../utils/env";
import { errorHandler } from "../utils/errorHandler";
import { sendEmail } from "../utils/sendEmail";

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(errorHandler(400, "All fields are required !!"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "User already existed !"));
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
            },
            JWT_TOKEN,
            { expiresIn: "7d" }
        );
        await sendEmail(
            newUser.email,
            "Welcome to AIPDF Extractor 🚀",
            `
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
    <p>— The AI PDF Extractor Team</p>
    <hr/>
    <small style="color:#777;">If you didn’t sign up for this account, please ignore this email.</small>
  </div>
  `
        );
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        next(errorHandler(500, "Error occured while saving user to database"));
    }
};
export const signInUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorHandler(400, "All fields are required !!"));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, "User not found"));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const token = jwt.sign(
            { id: validUser._id, email: validUser.email },
            JWT_TOKEN,
            { expiresIn: "7d" }
        );
        await sendEmail(
            validUser.email,
            "New login to your AI PDF Extractor account 🔐",
            `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello ${validUser.name || "there"},</h2>
    <p>We noticed a new login to your <strong>AI PDF Extractor</strong> account.</p>
    <p>If this was you, you can safely ignore this email.</p>
    <p>If it wasn’t you, we recommend resetting your password immediately to protect your data.</p>
    <br/>
    <p>Stay secure,</p>
    <p>— The AI PDF Extractor Security Team</p>
    <hr/>
    <small style="color:#777;">This is an automated email. Please do not reply.</small>
  </div>
  `
        );

        res.status(200).json({
            success: true,
            message: "Signed in successfully",
            user: { id: validUser._id, name: validUser.name, email: validUser.email },
            token,
        });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Error occured while signing in"));
    }
};

export const forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            res.status(200).json({
                success: true,
                message: "If this email exists, a reset link has been sent.",
            });
            return;
        }

        const rawToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex")

        existingUser.passwordResetTokenHash = hashedToken;
        existingUser.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 100)

        await existingUser.save();

        const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${rawToken}`;
        await sendEmail(
            existingUser.email,
            "Attempt to change password on your account 🔐",
            `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2>Hello ${existingUser.name || "there"},</h2>
  <p>We received a request to reset the password for your <strong>AI PDF Extractor</strong> account.</p>
  <p>If you made this request, you can reset your password by clicking the link below:</p>
  <p><a href="${resetPasswordLink}" style="color: #007bff; text-decoration: none;">Reset Your Password</a></p>
  <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
  <br/>
  <p>Stay secure,</p>
  <p>— The AI PDF Extractor Security Team</p>
  <hr/>
  <small style="color:#777;">This is an automated email. Please do not reply.</small>
</div>
  `
        );
        res.status(200).json({
            success: true,
            message: "If this email exists, a reset link has been sent.",
        });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Error occured while changing user password"));
    }
};
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return next(errorHandler(400, "Token and new password are required"));
        }
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const existingUser = await User.findOne({
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { $gt: new Date() }
        })

        if (!existingUser) {
            return next(errorHandler(400, "This password reset link is invalid or has expired."))
        }

        if (password) {
            if (!password) {
                return next(errorHandler(400, "Password is required."));
            }
            if (password.length < 8) {
                return next(errorHandler(400, "Password must be at least 8 characters long."));
            }
            if (!/[a-z]/.test(password)) {
                return next(errorHandler(400, "Password must contain at least one lowercase letter."));
            }
            if (!/[A-Z]/.test(password)) {
                return next(errorHandler(400, "Password must contain at least one uppercase letter."));
            }
            if (!/\d/.test(password)) {
                return next(errorHandler(400, "Password must include a number."));
            }
            if (!/[\W_]/.test(password)) {
                return next(errorHandler(400, "Password must include a special character."));
            }
        }
        if (existingUser.passwordHistory) {
            for (const p of existingUser.passwordHistory) {
                const isSame = await bcrypt.compare(password, p.hash);
                if (isSame) {
                    return next(errorHandler(400, "You can not reuse a recent password."));
                }
            }
        }
        if (!existingUser.passwordHistory) {
            existingUser.passwordHistory = [];
        }
        existingUser.passwordHistory.unshift({
            hash: existingUser.password,
            changedAt: new Date()
        })
        // Limit to last 3–5 passwords
        existingUser.passwordHistory = existingUser.passwordHistory.slice(0, 5);


        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.passwordResetExpiresAt = undefined;
        existingUser.passwordResetTokenHash = undefined;
        existingUser.passwordChangedAt = new Date();

        await Promise.all([
            existingUser.save(),
            sendEmail(
                existingUser.email,
                "Your password was changed ✅",
                `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Hello ${existingUser.name || "there"},</h2>
    <p>This is a confirmation that the password for your <strong>AI PDF Extractor</strong> account was successfully changed.</p>
    <p>If you made this change, no further action is needed.</p>
    <p>If you did <strong>not</strong> change your password, please <a href="" style="color: #007bff; text-decoration: none;">secure your account</a> immediately by resetting your password and reviewing your account activity.</p>
    <br/>
    <p>Stay safe,</p>
    <p>— The AI PDF Extractor Security Team</p>
    <hr/>
    <small style="color:#777;">This is an automated email. Please do not reply.</small>
  </div>
  `
            )
        ])
        res.status(200).json({ success: true, message: "Password reset successful!" });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Error occured while changing user password"));
    }
}
