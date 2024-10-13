import nodemailer from "nodemailer";
import env from "@/lib/env";
import Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOSTNAME,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURITY,
    auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
        type: "LOGIN",
    }
})

export async function sendMail(sendOptions: {
    to: string,
    subject: string,
    message: string,
    html: string,

}) {
    const options: Mail.Options = {...sendOptions, from: `MonoArc <${env.EMAIL_USERNAME}>`};

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                reject(error)
            }
            console.log(`error info: "${info}"`)
            resolve(info)
        })

    })
}


export async function sendForgotPassword(username: string, email: string, token: string) {
    await sendMail({
        to: `${username} ${email}`,
        subject: "Reset password",
        message: `
        Dear ${username},

        We received a request to reset your password for your account. If you did not make this request, please ignore this email.

        To reset your password, please click the link below:

        ${env.NEXT_PUBLIC_FORGOT_PASSWORD}?token=${token}

        Once you click the link, you will be directed to a page where you can create a new password. Please choose a strong password that you haven't used before.

        If you have any questions or need further assistance, feel free to reach out to our support team at wedonthave@atall.com.

        Thank you,
        The Support Team
        MonoArc
        `,
        html: `
        <p>Dear ${username},</p>

        <p>We received a request to reset your password for your account. If you did not make this request, please ignore this email.</p>

        <p>To reset your password, please click the link below:</p>

        <p>
            <a href="${env.NEXT_PUBLIC_FORGOT_PASSWORD}?token=${token}">Reset Your Password</a>
        </p>

        <p>Once you click the link, you will be directed to a page where you can create a new password. Please choose a strong password that you haven't used before.</p>

        <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:wedonthave@atall.com">wedonthave@atall.com</a>.</p>

        <p>Thank you,<br>
        The Support Team<br>
        MonoArc</p>
        `
    })
}