import nodemailer from "nodemailer";

// Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

// Send OTP email
export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"BakeHub OTP" <no-reply@bakehub.com>`,
      to: email,
      subject: "Your BakeHub OTP",
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>🔐 Your OTP Code</h2>
          <p>Use the following OTP to login:</p>
          <h1 style="letter-spacing: 4px">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Brevo OTP error:", error);
    return {
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    };
  }
};

export default transporter;
