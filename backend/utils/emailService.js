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

// -------------------- OTP EMAIL --------------------
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
    console.error("OTP email error:", error);
    return {
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    };
  }
};

// ---------------- ORDER CONFIRMATION EMAIL ----------------
export const sendOrderConfirmation = async (email, order) => {
  try {
    const mailOptions = {
      from: `"BakeHub Orders" <no-reply@bakehub.com>`,
      to: email,
      subject: "Your BakeHub Order Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>🎂 Order Confirmed!</h2>
          <p>Thank you for your order.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total:</strong> ₹${order.totalAmount}</p>
          <p>We’ll deliver your order soon 🚚</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return {
      success: false,
      error: "Failed to send order confirmation",
      details: error.message,
    };
  }
};

// Default export (safe)
export default transporter;
