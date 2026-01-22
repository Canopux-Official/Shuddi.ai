import nodemailer from 'nodemailer';
import { authenticator } from 'otplib';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"Shuddhi AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your code is: <strong style="font-size: 24px;">${otp}</strong></p>
          <p>Expires in 10 minutes.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Sent OTP to ${email}`);
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    throw new Error('Failed to send email');
  }
};

authenticator.options = { digits: 6, step: 600, window: 1 };

export const generateSecureOtp = () => {
  const secret = authenticator.generateSecret();
  return authenticator.generate(secret);
};