import chalk from "chalk";


import { Resend } from "resend";
import { EMAIL_PASS, EMAIL_USER, RESEND_API_KEY } from "./env";

const resend = new Resend(RESEND_API_KEY)
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "DocFeel <no-reply@docfeel.com>",
            to:[to],
            subject,
            html,
            replyTo: "support@docfeel.com",
        })
        if (error) {
            console.error("Resend error:", error);
            return false;
        }
        console.log("Email sent:", data?.id);
        return true;
    } catch (error) {
        console.log("Failed to send email:", error)
        return false;
    }
}
