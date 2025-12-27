# Gmail Email Setup Guide

## Common Error: "Invalid login: Username and Password not accepted"

This error occurs when Gmail authentication fails. Follow these steps to fix it:

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. Click on it and follow the prompts to enable it
5. **This is REQUIRED** - you cannot generate App Passwords without 2-Step Verification

### Step 2: Generate a Gmail App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - If you don't see this option, make sure 2-Step Verification is enabled first
2. You may need to sign in again
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Type "BakeHub" or any name you prefer
6. Click **Generate**
7. Google will show you a **16-character password** (like: `abcd efgh ijkl mnop`)
8. **Copy this password immediately** - you won't be able to see it again!

### Step 3: Update Your .env File

1. Open `backend/.env` file
2. Make sure `GMAIL_USER` is your full Gmail address:
   ```
   GMAIL_USER=your-email@gmail.com
   ```
3. Paste the **16-character App Password** (remove any spaces) in `GMAIL_APP_PASSWORD`:
   ```
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   - **Important**: Use the App Password, NOT your regular Gmail password
   - Remove any spaces from the password
   - It should be exactly 16 characters

### Step 4: Restart Your Server

After updating the `.env` file:
```bash
# Stop your current server (Ctrl+C)
# Then restart it:
cd backend
npm run dev
```

### Step 5: Test the Configuration

Try sending an OTP again. If it still fails, check:

- ✅ Is 2-Step Verification enabled?
- ✅ Did you use the App Password (not your regular password)?
- ✅ Is the App Password copied correctly (16 characters, no spaces)?
- ✅ Is the Gmail address correct?
- ✅ Did you restart the server after updating `.env`?

### Troubleshooting

**If you still get authentication errors:**

1. **Generate a new App Password** - Old ones might expire or be revoked
2. **Check for spaces** - Make sure there are no spaces in the App Password in your `.env` file
3. **Verify the email** - Make sure `GMAIL_USER` matches the Google Account where you generated the App Password
4. **Check account security** - Make sure your Google Account is not locked or restricted

**Alternative: Use a different email service**

If Gmail continues to cause issues, you can switch to:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer with other SMTP providers

---

## Quick Checklist

- [ ] 2-Step Verification is enabled on Google Account
- [ ] App Password generated from https://myaccount.google.com/apppasswords
- [ ] App Password copied correctly (16 characters, no spaces)
- [ ] `.env` file updated with correct `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- [ ] Server restarted after updating `.env`
- [ ] No spaces or extra characters in the App Password

