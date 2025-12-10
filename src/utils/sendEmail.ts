import chalk from "chalk";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { Resend } from "resend";
import { EMAIL_PASS, EMAIL_USER, RESEND_API_KEY } from "./env";

const resend = new Resend(RESEND_API_KEY)
export const sendEmail = async (to: string, subject: string, html: string) => {
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
    })
    chalk.blue(console.log("✅ Email sent successfully:," + subject))
    } catch (error) {
        console.log("Failed to send email:",error)
    }
}
