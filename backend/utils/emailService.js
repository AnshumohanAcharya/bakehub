import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file - try backend directory first, then root directory
const backendEnvPath = path.join(__dirname, '..', '.env');
const rootEnvPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: backendEnvPath });
// Also load from root if backend .env doesn't exist (for flexibility)
dotenv.config({ path: rootEnvPath, override: false });

// Validate email configuration
const validateEmailConfig = () => {
  if (!process.env.GMAIL_USER) {
    throw new Error('GMAIL_USER environment variable is not set');
  }
  if (!process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_APP_PASSWORD environment variable is not set');
  }
};

// Create transporter with validation
let transporter;

try {
  validateEmailConfig();
  
  // Trim whitespace from credentials (common issue with .env files)
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  
  // Debug logging
  console.log('📧 Email Configuration Status:');
  console.log('  GMAIL_USER:', gmailUser ? `${gmailUser.substring(0, 3)}***@${gmailUser.split('@')[1]}` : '❌ NOT SET');
  console.log('  GMAIL_APP_PASSWORD:', gmailPassword ? `✅ Set (${gmailPassword.length} characters)` : '❌ NOT SET');
  
  if (!gmailUser || !gmailPassword) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is empty after trimming');
  }
  
  if (gmailPassword.length !== 16) {
    console.warn('⚠️  Warning: Gmail App Password should be 16 characters. Current length:', gmailPassword.length);
  }
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });
  
  console.log('✅ Email transporter initialized successfully');
} catch (error) {
  console.error('❌ Email configuration error:', error.message);
  console.error('💡 To fix this:');
  console.error('   1. Create a .env file in the backend directory');
  console.error('   2. Add GMAIL_USER=your-email@gmail.com');
  console.error('   3. Add GMAIL_APP_PASSWORD=your-16-char-app-password');
  console.error('   4. See EMAIL_SETUP_GUIDE.md for detailed instructions');
  transporter = null;
}

// Function to initialize transporter (can be called multiple times)
const initializeTransporter = () => {
  try {
    // Reload env vars in case they weren't available at module load
    const backendEnvPath = path.join(__dirname, '..', '.env');
    const rootEnvPath = path.join(__dirname, '..', '..', '.env');
    dotenv.config({ path: backendEnvPath });
    dotenv.config({ path: rootEnvPath, override: false });
    
    validateEmailConfig();
    
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();
    
    if (!gmailUser || !gmailPassword) {
      throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is empty after trimming');
    }
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize transporter:', error.message);
    transporter = null;
    return false;
  }
};

// Verify transporter connection (optional, can be called separately)
export const verifyEmailService = async () => {
  if (!transporter) {
    // Try to initialize if not already done
    if (!initializeTransporter()) {
      throw new Error('Email transporter is not configured. Please check your environment variables.');
    }
  }
  
  try {
    await transporter.verify();
    console.log('Email service verified successfully');
    return true;
  } catch (error) {
    console.error('Transporter verification failed:', error.message);
    throw error;
  }
};

export const sendOTP = async (email, otp) => {
  try {
    // Try to initialize transporter if it's not already initialized
    if (!transporter) {
      console.log('Transporter not initialized, attempting to initialize...');
      if (!initializeTransporter()) {
        const configError = 'Email service is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file.';
        console.error('Email service not configured:', {
          GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'NOT SET',
          GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'NOT SET'
        });
        
        return {
          success: false,
          error: configError,
          details: 'To fix this:\n' +
            '1. Create a .env file in the backend directory\n' +
            '2. Add GMAIL_USER=your-email@gmail.com\n' +
            '3. Add GMAIL_APP_PASSWORD=your-16-char-app-password\n' +
            '4. Restart the server\n' +
            'See EMAIL_SETUP_GUIDE.md for detailed instructions.'
        };
      }
      console.log('Transporter initialized successfully');
    }

    const mailOptions = {
      from: process.env.GMAIL_USER?.trim(),
      to: email,
      subject: 'BakeHub - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">BakeHub</h2>
          <p>Your OTP for login is:</p>
          <h1 style="color: #d97706; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP:', {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
      responseCode: error.responseCode
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP';
    let detailedMessage = '';
    
    if (error.message.includes('Invalid login') || 
        error.message.includes('Username and Password not accepted') || 
        error.code === 'EAUTH' ||
        error.responseCode === 535) {
      errorMessage = 'Invalid Gmail credentials. Authentication failed.';
      detailedMessage = 'Please verify:\n' +
        '1. GMAIL_USER is your correct Gmail address\n' +
        '2. GMAIL_APP_PASSWORD is a Gmail App Password (not your regular password)\n' +
        '3. 2-Step Verification is enabled in your Google Account\n' +
        '4. You generated the App Password from: https://myaccount.google.com/apppasswords\n' +
        '5. The App Password is copied correctly (16 characters, no spaces)\n' +
        '6. Restart the server after updating .env file';
    } else if (error.message.includes('not configured')) {
      errorMessage = 'Email service is not configured.';
      detailedMessage = 'Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file.\n' +
        'See EMAIL_SETUP_GUIDE.md for detailed instructions.';
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection to email service failed.';
      detailedMessage = 'Please check your internet connection and try again.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address.';
      detailedMessage = 'Please provide a valid email address.';
    } else {
      errorMessage = error.message || 'Failed to send OTP email';
      detailedMessage = `Error: ${error.message}\n` +
        'Check the server logs for more details.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: detailedMessage || undefined
    };
  }
};

export const sendOrderConfirmation = async (email, orderDetails) => {
  try {
    if (!transporter) {
      throw new Error('Email service is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file.');
    }

    const mailOptions = {
      from: process.env.GMAIL_USER?.trim(),
      to: email,
      subject: `BakeHub - Order Confirmation #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Order Confirmed!</h2>
          <p>Thank you for your order. Your order has been confirmed.</p>
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
          <p><strong>Delivery Date:</strong> ${orderDetails.deliveryDate}</p>
          <p><strong>Delivery Time:</strong> ${orderDetails.deliveryTime}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return { success: false, error: error.message || 'Failed to send order confirmation email' };
  }
};

