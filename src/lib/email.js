import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Email templates
const getEmailTemplate = (type, data) => {
  switch (type) {
    case "email_verification":
      return {
        subject: "Verify Your Email - Commerce Platform",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Email Verification</h1>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${
                data.name
              },</p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for registering with our Commerce Platform. Please use the following OTP to verify your email address:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #C9AF2F; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                  ${data.otp}
                </div>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                This OTP will expire in 10 minutes. If you didn't request this verification, please ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Commerce Platform. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    case "password_reset":
      return {
        subject: "Reset Your Password - Commerce Platform",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset</h1>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${
                data.name
              },</p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                You requested to reset your password. Please use the following OTP to proceed:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #dc3545; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                  ${data.otp}
                </div>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                This OTP will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Commerce Platform. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    default:
      return null;
  }
};

// Send email function
export const sendEmail = async (to, type, data) => {
  try {
    const transporter = createTransporter();
    const template = getEmailTemplate(type, data);

    if (!template) {
      throw new Error("Invalid email template type");
    }

    const mailOptions = {
      from: `"Commerce Platform" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
