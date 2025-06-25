# Email Authentication Setup

This document explains the email verification and password reset functionality that has been added to the commerce platform.

## Features Added

### 1. Email Verification

- New users must verify their email address after registration
- OTP (One-Time Password) sent via email
- Users cannot login until email is verified

### 2. Password Reset

- Forgot password functionality with OTP verification
- Secure password reset flow
- Email notifications for password reset requests

### 3. Enhanced Security

- Account locking after failed login attempts
- OTP expiration (10 minutes)
- Rate limiting for OTP requests
- Password strength validation

## API Routes

### `/api/auth/register` (POST)

- Registers new user and sends email verification OTP
- Updated to include email verification flow

### `/api/auth/verify-otp` (POST)

- Verifies OTP for email verification or password reset
- **Body**: `{ email, otp, purpose }`
- **Purpose**: `"email_verification"` or `"password_reset"`

### `/api/auth/verify-otp` (PUT)

- Resends OTP for email verification or password reset
- **Body**: `{ email, purpose }`

### `/api/auth/forget-password` (POST)

- Initiates password reset flow
- Sends OTP to user's email
- **Body**: `{ email }`

### `/api/auth/reset-password` (POST)

- Resets user password after OTP verification
- **Body**: `{ email, resetToken, newPassword }`

## Database Models

### User Model Updates

Added fields:

- `emailVerified`: Boolean
- `emailVerifiedAt`: Date
- `passwordResetToken`: String
- `passwordResetExpiresAt`: Date
- `lastLoginAt`: Date
- `failedLoginAttempts`: Number
- `accountLockedUntil`: Date

### OTP Model (New)

- `email`: String
- `otp`: String (6-digit)
- `purpose`: String ("email_verification" | "password_reset")
- `expiresAt`: Date (10 minutes)
- `verified`: Boolean
- `attempts`: Number (max 5)

## Email Configuration

### Environment Variables Required

Add these to your `.env.local` file:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Other Email Providers

For other SMTP providers, update:

- `EMAIL_HOST`: Your SMTP server
- `EMAIL_PORT`: SMTP port (usually 587 or 465)
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email password or app password

## User Flow

### Registration Flow

1. User registers with email/password
2. Account created but `emailVerified = false`
3. OTP sent to user's email
4. User enters OTP on verification page
5. Email verified, user can now login

### Login Flow

1. User attempts to login
2. System checks if email is verified
3. If not verified, shows error and option to resend OTP
4. If verified, login proceeds normally

### Password Reset Flow

1. User clicks "Forgot Password"
2. Enters email address
3. OTP sent to email
4. User enters OTP on verification page
5. System generates reset token
6. User enters new password
7. Password updated, user can login

## Security Features

### Account Protection

- Maximum 5 failed login attempts
- Account locked for 15 minutes after 5 failures
- Failed attempts reset on successful login

### OTP Protection

- OTPs expire after 10 minutes
- Maximum 5 verification attempts per OTP
- Rate limiting: 3 password reset OTPs per hour
- Old OTPs deleted when new ones are generated

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Testing

### Test Email Verification

1. Register a new account
2. Check your email for OTP
3. Enter OTP on verification page
4. Try logging in

### Test Password Reset

1. Go to login page
2. Click "Forgot Password"
3. Enter your email
4. Check email for reset OTP
5. Enter OTP and set new password

## Troubleshooting

### Email Not Sending

- Check `EMAIL_*` environment variables
- Verify SMTP credentials
- Check spam/junk folder
- Test with email verification in browser console

### Database Issues

- Ensure MongoDB is running
- Check database connection
- Verify OTP model is created

### Common Errors

- "Email not verified": User needs to verify email first
- "Invalid OTP": OTP expired or wrong code
- "Too many attempts": Rate limiting active
- "Account locked": Too many failed login attempts

## Production Considerations

1. **Email Service**: Consider using services like:

   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Security**:

   - Use strong EMAIL_PASS
   - Enable CORS properly
   - Add rate limiting middleware

3. **Monitoring**:

   - Log email send failures
   - Monitor OTP success rates
   - Track failed login attempts

4. **Backup**:
   - Regular database backups
   - OTP cleanup jobs for expired records
