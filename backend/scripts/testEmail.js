import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file - try backend directory first, then root directory
const backendEnvPath = path.join(__dirname, '..', '.env');
const rootEnvPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: backendEnvPath });
// Also load from root if backend .env doesn't exist (for flexibility)
dotenv.config({ path: rootEnvPath, override: false });

const testEmailConnection = async () => {
  console.log('🔍 Testing Gmail Email Configuration...\n');

  // Check environment variables
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();

  console.log('📋 Configuration Check:');
  console.log('  GMAIL_USER:', gmailUser ? `${gmailUser.substring(0, 3)}***@${gmailUser.split('@')[1]}` : '❌ NOT SET');
  console.log('  GMAIL_APP_PASSWORD:', gmailPassword ? `✅ Set (${gmailPassword.length} characters)` : '❌ NOT SET');
  console.log('');

  if (!gmailUser || !gmailPassword) {
    console.error('❌ Error: GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env file');
    console.log('\n💡 Make sure your .env file contains:');
    console.log('   GMAIL_USER=your-email@gmail.com');
    console.log('   GMAIL_APP_PASSWORD=your-16-character-app-password');
    process.exit(1);
  }

  if (gmailPassword.length !== 16) {
    console.warn('⚠️  Warning: Gmail App Password should be 16 characters');
    console.log(`   Current length: ${gmailPassword.length} characters`);
    console.log('   Make sure there are no spaces or extra characters');
  }

  // Create transporter
  console.log('🔌 Creating email transporter...');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });

  // Test connection
  console.log('🔐 Verifying Gmail credentials...\n');
  try {
    await transporter.verify();
    console.log('✅ SUCCESS! Gmail credentials are valid and working!');
    console.log('\n📧 You can now send emails from your application.');
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED! Gmail authentication error:\n');
    console.error('   Error:', error.message);
    console.error('');

    if (error.message.includes('Invalid login') || error.message.includes('Username and Password not accepted')) {
      console.log('💡 Troubleshooting Steps:');
      console.log('');
      console.log('1. ✅ Verify 2-Step Verification is enabled:');
      console.log('   https://myaccount.google.com/security');
      console.log('');
      console.log('2. ✅ Generate a NEW App Password:');
      console.log('   https://myaccount.google.com/apppasswords');
      console.log('   - Select "Mail"');
      console.log('   - Select "Other (Custom name)" and type "BakeHub"');
      console.log('   - Click "Generate"');
      console.log('   - Copy the 16-character password (no spaces)');
      console.log('');
      console.log('3. ✅ Update your .env file:');
      console.log(`   GMAIL_USER=${gmailUser}`);
      console.log('   GMAIL_APP_PASSWORD=<paste-new-16-char-password-here>');
      console.log('');
      console.log('4. ✅ Make sure:');
      console.log('   - No spaces in the App Password');
      console.log('   - Using App Password, NOT your regular Gmail password');
      console.log('   - The email matches the Google Account where you generated the App Password');
      console.log('');
      console.log('5. ✅ Restart your server after updating .env');
    } else if (error.code === 'EAUTH') {
      console.log('💡 This is an authentication error. Follow the steps above.');
    } else {
      console.log('💡 Check your internet connection and try again.');
    }

    process.exit(1);
  }
};

testEmailConnection();

