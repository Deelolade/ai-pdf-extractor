import chalk from "chalk";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { Resend } from "resend";
import { EMAIL_PASS, EMAIL_USER, RESEND_API_KEY } from "./env";

const resend = new Resend(RESEND_API_KEY)
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
    const results = await resend.emails.send({
        from: "DocFeel <no-reply@docfeel.com>",
        to,
        subject,
        html
    })
    console.log("results fron resend",results);
    chalk.blue(console.log("✅ Email sent successfully:" + subject))
    } catch (error) {
        console.log("Failed to send email:",error)
    }
}
