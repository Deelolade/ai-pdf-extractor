import chalk from "chalk";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EMAIL_PASS, EMAIL_USER } from "./env";
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    } as SMTPTransport.Options);
    const mailOptions = {
        from: "habeeboluwanishola13@gmail.com",
        to,
        subject,
        html,
    }
    const info = await transporter.sendMail(mailOptions);
    chalk.blue(console.log("✅ Email sent successfully:", info.messageId))
    } catch (error) {
        console.log("Failed to send email:",error)
    }
}
