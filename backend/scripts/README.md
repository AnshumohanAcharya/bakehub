# BakeHub Setup Scripts

This directory contains utility scripts for setting up and managing the BakeHub application.

## Available Scripts

### 1. Create Super Admin
Creates the first super admin user in the database.

```bash
npm run create-admin
```

Or directly:
```bash
node scripts/createAdmin.js
```

**What it does:**
- Creates a super admin with email: `admin@bakehub.com`
- Checks if admin already exists to prevent duplicates
- You can then login with this email using OTP authentication

---

### 2. Add Sample Pincodes
Adds sample delivery pincodes for major Indian cities.

```bash
npm run add-pincodes
```

Or directly:
```bash
node scripts/addSamplePincodes.js
```

**What it does:**
- Adds 10 sample pincodes for major cities:
  - New Delhi (110001, 110002, 110003)
  - Mumbai (400001, 400002)
  - Bangalore (560001, 560002)
  - Kolkata (700001)
  - Chennai (600001)
  - Ahmedabad (380001)
- Skips pincodes that already exist
- All pincodes are set as active

**To add your own pincodes:**
- Use the Admin Panel → Pincodes
- Or edit `addSamplePincodes.js` and add more entries

---

### 3. Add Sample Coupon
Creates the "NEWYEAR26" coupon as mentioned in the requirements.

```bash
npm run add-coupon
```

Or directly:
```bash
node scripts/addSampleCoupon.js
```

**What it does:**
- Creates coupon code: `NEWYEAR26`
- 30% discount (max ₹1000)
- Minimum order: ₹500
- Valid until: December 31, 2026
- Usage limit: 100 times
- Matches the banner offer mentioned in requirements

**To create more coupons:**
- Use the Admin Panel → Coupons
- Or edit `addSampleCoupon.js` to create different coupons

---

## Usage Order

For a fresh setup, run scripts in this order:

1. **Create Super Admin** (required)
   ```bash
   npm run create-admin
   ```

2. **Add Sample Pincodes** (recommended)
   ```bash
   npm run add-pincodes
   ```

3. **Add Sample Coupon** (optional)
   ```bash
   npm run add-coupon
   ```

---

## Customization

All scripts can be customized by editing the respective files:
- `createAdmin.js` - Change admin email
- `addSamplePincodes.js` - Add/remove pincodes
- `addSampleCoupon.js` - Change coupon details

---

## Notes

- All scripts check for existing data to prevent duplicates
- Scripts use the same `.env` configuration as the main application
- Make sure MongoDB is running before executing scripts
- Scripts will exit with error code 1 if something goes wrong

