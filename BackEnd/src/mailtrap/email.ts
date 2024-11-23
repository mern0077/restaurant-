import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./HtmlEmail.js";
import { client, sender } from "./Mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipients = [{ email }]
    try {
        const res = await client.send({  
            from: sender,
            to: recipients,
            subject: "verify your email",
            html: htmlContent.replace("{verificationToken}", verificationToken),
            category: "Email verification",
        })
        console.log(res);
    } catch (error: any) {
        console.log(`Error from sendVerificationEmail ${error.message}`);
        throw new Error("Failed to send email verification");
    }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipients = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await client.send({
            from: sender,
            to: recipients,
            subject: "welcome to Joseph Food",
            category: "Email verification",
            html: htmlContent,
            template_variables: {
                company_info_name: "Joseph Food",
                name: name,
            }
        })

    } catch (error: any) {
        console.log(`Error from sendWelcomeEmail ${error.message}`);
        throw new Error("Failed to send welcome email");
    }
}

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const recipients = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.send({
            from: sender,
            to: recipients,
            subject: "Reset your password",
            html: htmlContent,
            category: "Reset password",
        })

    } catch (error: any) {
        console.log(`Error from sendPasswordResetEmail ${error.message}`);
        throw new Error("Failed to send Reset Email ");
    }
}

export const sendResetSuccessEmail = async (email: string) => {
    const recipients = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from: sender,
            to: recipients,
            subject: "password reset successfully",
            html: htmlContent,
            category: "password Reset",
        })

    } catch (error: any) {
        console.log(`Error from sendResetSuccessEmail ${error.message}`);
        throw new Error("Failed to send Success Email");
    }
}