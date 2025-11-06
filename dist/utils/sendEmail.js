"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const chalk_1 = __importDefault(require("chalk"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: env_1.EMAIL_USER,
                pass: env_1.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: "habeeboluwanishola13@gmail.com",
            to,
            subject,
            html,
        };
        const info = await transporter.sendMail(mailOptions);
        chalk_1.default.blue(console.log("✅ Email sent successfully:", info.messageId));
    }
    catch (error) {
        console.log("Failed to send email:", error);
    }
};
exports.sendEmail = sendEmail;
