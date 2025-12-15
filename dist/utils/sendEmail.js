"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const env_1 = require("./env");
const resend = new resend_1.Resend(env_1.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "DocFeel <no-reply@docfeel.com>",
            to: [to],
            subject,
            html,
            replyTo: "support@docfeel.com",
        });
        if (error) {
            console.error("Resend error:", error);
            return false;
        }
        console.log("Email sent:", data?.id);
        return true;
    }
    catch (error) {
        console.log("Failed to send email:", error);
        return false;
    }
};
exports.sendEmail = sendEmail;
