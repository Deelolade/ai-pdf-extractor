"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const chalk_1 = __importDefault(require("chalk"));
const resend_1 = require("resend");
const env_1 = require("./env");
const resend = new resend_1.Resend(env_1.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    try {
        //     const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: EMAIL_USER,
        //         pass: EMAIL_PASS
        //     }
        // } as SMTPTransport.Options);
        // const mailOptions = {
        //     from: "habeeboluwanishola13@gmail.com",
        //     to,
        //     subject,
        //     html,
        // }
        // const info = await transporter.sendMail(mailOptions);
        await resend.emails.send({
            from: "DocFeel <onboarding@resend.dev>",
            to,
            subject,
            html
        });
        chalk_1.default.blue(console.log("✅ Email sent successfully:"));
    }
    catch (error) {
        console.log("Failed to send email:", error);
    }
};
exports.sendEmail = sendEmail;
