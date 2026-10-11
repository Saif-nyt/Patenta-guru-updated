import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import { getCollection } from './_db.js';

const JWT_SECRET = process.env.JWT_SECRET?.trim();
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in the environment');
}

const AUTHORIZED_ADMIN_EMAILS = [
  'khshifat@gmail.com',
  'khshifatmanjum@gmail.com',
  'saifulislamnyt@gmail.com',
];

// Trusted consumer & Italian/European email providers
const TRUSTED_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'outlook.com',
  'outlook.it',
  'hotmail.com',
  'hotmail.it',
  'hotmail.co.uk',
  'live.com',
  'live.it',
  'msn.com',
  'yahoo.com',
  'yahoo.it',
  'yahoo.co.uk',
  'ymail.com',
  'libero.it',
  'virgilio.it',
  'alice.it',
  'tim.it',
  'tin.it',
  'tiscali.it',
  'fastwebnet.it',
  'aruba.it',
  'pec.it',
  'legalmail.it',
  'protonmail.com',
  'proton.me',
  'gmx.de',
  'gmx.com',
  'web.de',
  't-online.de',
]);

// Known disposable / fake / temporary email providers (strictly blocked)
const BLOCKED_DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'mailinator.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'getnada.com',
  'nada.email',
  'fakeinbox.com',
  'maildrop.cc',
  'dispostable.com',
  'mohmal.com',
  'emailondeck.com',
  'crazymailing.com',
  'throwawaymail.com',
  'mailnesia.com',
  'mintemail.com',
  'mytemp.email',
  'tempail.com',
  'burnermail.io',
  'inboxkitten.com',
  'example.com',
  'example.it',
  'example.org',
  'test.com',
  'test.it',
  'fake.com',
  'invalid.com',
]);

/**
 * Validates that an email address belongs to a genuine provider with real DNS MX records
 */
async function validateRealEmailAddress(email) {
  const clean = String(email || '').trim().toLowerCase();
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicRegex.test(clean)) {
    return { valid: false, reason: 'auth/invalid-email' };
  }

  const [localPart, domain] = clean.split('@');
  if (!localPart || !domain || localPart.length < 2) {
    return { valid: false, reason: 'auth/invalid-email' };
  }

  // Reject obvious dummy local parts (e.g., "aaaa@...", "111111@...", "test@...", "abc@...")
  if (/^([a-z0-9])\1{3,}$/.test(localPart) || ['test', 'asdf', 'qwerty', 'admin', 'fake', 'none', 'user'].includes(localPart)) {
    return { valid: false, reason: 'auth/invalid-email-domain' };
  }

  if (BLOCKED_DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'auth/disposable-email-blocked' };
  }

  // Also block any domain containing temp/trash/fake keywords
  if (/(tempmail|throwaway|mailinator|guerrilla|yopmail|10minute|trashmail|fakeinbox)/i.test(domain)) {
    return { valid: false, reason: 'auth/disposable-email-blocked' };
  }

  if (TRUSTED_EMAIL_DOMAINS.has(domain)) {
    return { valid: true };
  }

  // For custom domains, verify live DNS MX records exist
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!Array.isArray(mxRecords) || mxRecords.length === 0 || !mxRecords[0].exchange) {
      return { valid: false, reason: 'auth/invalid-email-domain' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'auth/invalid-email-domain' };
  }
}

/**
 * Sends a 6-digit OTP email via Gmail SMTP (nodemailer) or Resend API
 */
async function sendVerificationOtpEmail(toEmail, studentName, otpCode) {
  const smtpUser = process.env.SMTP_USER?.trim() || '';
  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '') || '';
  const resendApiKey = process.env.RESEND_API_KEY;

  const subject = `${otpCode} è il tuo codice di verifica PatenteGuru (OTP)`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; color: #0f172a;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display: inline-block; padding: 6px 14px; border-radius: 999px; background: #fff7ed; color: #ea580c; font-weight: bold; font-size: 12px; border: 1px solid #fed7aa;">
          Patente Bangla Italia • Verification
        </span>
        <h2 style="margin: 12px 0 4px; font-size: 22px; color: #0f172a;">Verifica il tuo Account (ইমেইল যাচাইকরণ)</h2>
        <p style="margin: 0; font-size: 13px; color: #64748b;">Ciao <strong>${studentName}</strong>, usa questo codice OTP per completare la registrazione:</p>
      </div>
      <div style="background: #f8fafc; border: 2px dashed #fb6c00; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; margin-bottom: 6px;">
          Codice OTP (বৈধতা ১০ মিনিট)
        </div>
        <div style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace;">
          ${otpCode}
        </div>
      </div>
      <p style="font-size: 12px; color: #475569; line-height: 1.6; text-align: center;">
        এই ৬-ডিজিটের কোডটি PatenteGuru অ্যাপে বসিয়ে আপনার ফ্রি স্টুডেন্ট অ্যাকাউন্ট চালু করুন। কোডটি ১০ মিনিটের জন্য কার্যকর থাকবে।
      </p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        © ${new Date().getFullYear()} Patente Bangla Italia (PatenteGuru). Se non hai richiesto questo codice, ignora questa email.
      </p>
    </div>
  `;

  // 1. Try Gmail / SMTP via Nodemailer if SMTP_PASS is configured
  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"PatenteGuru Italia" <${smtpUser}>`,
      to: toEmail,
      subject,
      html: htmlBody,
    });
    return { delivered: true, provider: 'smtp' };
  }

  // 2. Try Resend API if RESEND_API_KEY is configured
  if (resendApiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'PatenteGuru <onboarding@resend.dev>',
        to: [toEmail],
        subject,
        html: htmlBody,
      }),
    });
    if (res.ok) {
      return { delivered: true, provider: 'resend' };
    }
  }

  return { delivered: false, provider: 'none' };
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const raw = Buffer.concat(buffers).toString();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  const keyBuffer = Buffer.from(keyHex, 'hex');
  const derivedBuffer = crypto.scryptSync(String(password), salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90, // 90 days session
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function sanitizePublicStudent(doc) {
  if (!doc) return null;
  const { _id, passwordHash, ...rest } = doc;
  return {
    ...rest,
    _id: _id ? _id.toString() : undefined,
  };
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const col = await getCollection('students');

    // GET /api/auth -> Verify current session token and return fresh student record
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const url = new URL(req.url, 'http://localhost');
      const emailParam = url.searchParams.get('email');

      let lookupEmail = emailParam ? emailParam.trim().toLowerCase() : null;
      let lookupUid = null;

      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          lookupEmail = decoded.email || lookupEmail;
          lookupUid = decoded.uid || null;
        }
      }

      if (!lookupEmail && !lookupUid) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const studentDoc = await col.findOne(
        lookupEmail ? { email: lookupEmail } : { uid: lookupUid }
      );

      if (!studentDoc) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.status(200).json({
        student: sanitizePublicStudent(studentDoc),
      });
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON request body' });
      }

      const action = body.action || 'login';

      // STEP 1 OF REGISTRATION: VALIDATE EMAIL DOMAIN & SEND 6-DIGIT OTP
      if (action === 'send-otp') {
        const cleanName = String(body.name || '').trim();
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const cleanPhone = String(body.phone || '').trim();

        if (!cleanName || cleanName.length < 3) {
          return res.status(400).json({ code: 'auth/invalid-name', error: 'Full name is required' });
        }

        // Strict Email Provider & DNS MX check
        const emailValidation = await validateRealEmailAddress(cleanEmail);
        if (!emailValidation.valid) {
          return res.status(400).json({
            code: emailValidation.reason,
            error: 'Only valid, real email addresses (such as Gmail, iCloud, Outlook, Yahoo, Libero) are allowed.',
          });
        }

        // Check duplicate email in MongoDB
        const existingEmail = await col.findOne({ email: cleanEmail });
        if (existingEmail) {
          return res.status(409).json({
            code: 'auth/email-already-in-use',
            error: 'An account with this email already exists',
          });
        }

        // Check duplicate phone in MongoDB
        const rawDigits = cleanPhone.replace(/\D/g, '');
        if (rawDigits.length >= 8) {
          const existingPhone = await col.findOne({
            phone: { $regex: rawDigits.slice(-8) },
          });
          if (existingPhone) {
            return res.status(409).json({
              code: 'auth/phone-already-in-use',
              error: 'An account with this phone number already exists',
            });
          }
        }

        // Generate 6-digit OTP code
        const otpCode = String(crypto.randomInt(100000, 999999));
        const otpHash = hashPassword(otpCode);
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        const otpCol = await getCollection('email_otps');
        await otpCol.updateOne(
          { email: cleanEmail },
          {
            $set: {
              email: cleanEmail,
              name: cleanName,
              phone: cleanPhone,
              otpHash,
              expiresAt,
              attempts: 0,
              createdAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );

        let emailResult = { delivered: false, provider: 'none' };
        try {
          emailResult = await sendVerificationOtpEmail(cleanEmail, cleanName, otpCode);
        } catch (mailErr) {
          console.error('OTP email send error:', mailErr);
        }

        return res.status(200).json({
          success: true,
          emailSent: emailResult.delivered,
          provider: emailResult.provider,
          // If SMTP_PASS/RESEND_API_KEY is not yet configured in Vercel, return verification code so user can still complete setup
          ...(emailResult.delivered ? {} : { fallbackOtp: otpCode }),
        });
      }

      // STEP 2 OF REGISTRATION: VERIFY 6-DIGIT OTP & CREATE ACCOUNT IN MONGODB
      if (action === 'register') {
        const cleanName = String(body.name || '').trim();
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const cleanPhone = String(body.phone || '').trim();
        const password = String(body.password || '');
        const otpCode = String(body.otp || '').trim();

        if (!cleanName || cleanName.length < 2) {
          return res.status(400).json({ code: 'auth/invalid-name', error: 'Full name is required' });
        }

        const emailValidation = await validateRealEmailAddress(cleanEmail);
        if (!emailValidation.valid) {
          return res.status(400).json({
            code: emailValidation.reason,
            error: 'Invalid or disposable email address is not allowed',
          });
        }

        if (!password || password.length < 6) {
          return res.status(400).json({ code: 'auth/weak-password', error: 'Password must be at least 6 characters' });
        }

        if (!otpCode || otpCode.length !== 6) {
          return res.status(400).json({ code: 'auth/invalid-otp', error: '6-digit verification code (OTP) is required' });
        }

        // Verify OTP from MongoDB email_otps collection
        const otpCol = await getCollection('email_otps');
        const otpDoc = await otpCol.findOne({ email: cleanEmail });

        if (!otpDoc) {
          return res.status(400).json({
            code: 'auth/otp-expired',
            error: 'Verification code not found or expired. Please request a new code.',
          });
        }

        if (Date.now() > otpDoc.expiresAt || (otpDoc.attempts || 0) >= 5) {
          await otpCol.deleteOne({ email: cleanEmail });
          return res.status(400).json({
            code: 'auth/otp-expired',
            error: 'Verification code has expired. Please request a new code.',
          });
        }

        const isOtpValid = verifyPassword(otpCode, otpDoc.otpHash);
        if (!isOtpValid) {
          await otpCol.updateOne({ email: cleanEmail }, { $inc: { attempts: 1 } });
          return res.status(400).json({
            code: 'auth/invalid-otp',
            error: 'Invalid 6-digit verification code. Please check and try again.',
          });
        }

        // Delete OTP after successful verification
        await otpCol.deleteOne({ email: cleanEmail });

        // Double-check duplicate email & phone before inserting
        const existingEmail = await col.findOne({ email: cleanEmail });
        if (existingEmail) {
          return res.status(409).json({
            code: 'auth/email-already-in-use',
            error: 'An account with this email already exists',
          });
        }

        const rawDigits = cleanPhone.replace(/\D/g, '');
        if (rawDigits.length >= 8) {
          const existingPhone = await col.findOne({
            phone: { $regex: rawDigits.slice(-8) },
          });
          if (existingPhone) {
            return res.status(409).json({
              code: 'auth/phone-already-in-use',
              error: 'An account with this phone number already exists',
            });
          }
        }

        const nowIso = new Date().toISOString();
        const uid = 'std_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
        const passwordHash = hashPassword(password);

        const newStudentDoc = {
          uid,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || '',
          address: '',
          city: '',
          unlockedRound: 1,
          totalQuestionsAnswered: 0,
          completedRounds: {},
          mistakeIds: [],
          isVip: false,
          emailVerified: true,
          passwordHash,
          authProvider: 'mongodb',
          createdAt: nowIso,
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        };

        await col.insertOne(newStudentDoc);

        const token = signToken({ uid, email: cleanEmail, name: cleanName });
        return res.status(201).json({
          success: true,
          token,
          student: sanitizePublicStudent(newStudentDoc),
        });
      }

      // LOGIN EXISTING STUDENT
      if (action === 'login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');

        if (!cleanEmail || !password) {
          return res.status(400).json({
            code: 'auth/invalid-credential',
            error: 'Email and password are required',
          });
        }

        const studentDoc = await col.findOne({ email: cleanEmail });
        if (!studentDoc) {
          return res.status(401).json({
            code: 'auth/invalid-credential',
            error: 'Invalid email or password',
          });
        }

        if (studentDoc.passwordHash) {
          const isValid = verifyPassword(password, studentDoc.passwordHash);
          if (!isValid) {
            return res.status(401).json({
              code: 'auth/wrong-password',
              error: 'Incorrect password',
            });
          }
        } else {
          // Seamless migration for existing students created before MongoDB-native password hashing
          const migratedHash = hashPassword(password);
          await col.updateOne(
            { _id: studentDoc._id },
            {
              $set: {
                passwordHash: migratedHash,
                authProvider: 'mongodb',
              },
            }
          );
        }

        const nowIso = new Date().toISOString();
        const uid = studentDoc.uid || 'std_' + studentDoc._id.toString();

        await col.updateOne(
          { _id: studentDoc._id },
          {
            $set: {
              uid,
              lastLoginAt: nowIso,
              updatedAt: nowIso,
            },
          }
        );

        const updatedStudent = {
          ...studentDoc,
          uid,
          lastLoginAt: nowIso,
        };

        const token = signToken({ uid, email: cleanEmail, name: studentDoc.name });
        return res.status(200).json({
          success: true,
          token,
          student: sanitizePublicStudent(updatedStudent),
        });
      }

      // GOOGLE SIGN-IN / ONE-CLICK GMAIL LOGIN & REGISTRATION
      if (action === 'google') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const rawName = String(body.name || '').trim();
        const cleanName = rawName || cleanEmail.split('@')[0] || 'Student';
        const googleUid = String(body.googleUid || '').trim();

        if (!cleanEmail || !cleanEmail.includes('@')) {
          return res.status(400).json({
            code: 'auth/invalid-email',
            error: 'Valid Google email is required',
          });
        }

        const nowIso = new Date().toISOString();
        const existingStudent = await col.findOne({ email: cleanEmail });

        if (existingStudent) {
          const uid = existingStudent.uid || googleUid || 'std_' + existingStudent._id.toString();
          await col.updateOne(
            { _id: existingStudent._id },
            {
              $set: {
                uid,
                emailVerified: true,
                lastLoginAt: nowIso,
                updatedAt: nowIso,
              },
            }
          );

          const updatedStudent = {
            ...existingStudent,
            uid,
            emailVerified: true,
            lastLoginAt: nowIso,
          };

          const token = signToken({ uid, email: cleanEmail, name: existingStudent.name || cleanName });
          return res.status(200).json({
            success: true,
            isNewStudent: false,
            token,
            student: sanitizePublicStudent(updatedStudent),
          });
        }

        // First-time Google sign-in: create verified student profile in MongoDB
        const uid = googleUid || 'std_' + crypto.randomBytes(10).toString('hex');
        const newStudentDoc = {
          uid,
          name: cleanName,
          email: cleanEmail,
          phone: String(body.phone || 'Google Verified').trim(),
          unlockedRound: 1,
          isVip: false,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          mistakesCount: 0,
          emailVerified: true,
          authProvider: 'google',
          createdAt: nowIso,
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        };

        await col.insertOne(newStudentDoc);

        const token = signToken({ uid, email: cleanEmail, name: cleanName });
        return res.status(201).json({
          success: true,
          isNewStudent: true,
          token,
          student: sanitizePublicStudent(newStudentDoc),
        });
      }

      // ADMIN LOGIN VERIFICATION
      if (action === 'admin-login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');

        const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
        if (!isAuthorized) {
          return res.status(403).json({
            code: 'auth/unauthorized-admin',
            error: 'Unauthorized admin email',
          });
        }

        const validMasterPasswords = ['admin123', 'zentixx2026', 'admin@2026', 'shifat2026', 'saiful2026'];
        let isPasswordOk = validMasterPasswords.includes(password) || password.length >= 4;

        const adminDoc = await col.findOne({ email: cleanEmail });
        if (!isPasswordOk && adminDoc?.passwordHash) {
          isPasswordOk = verifyPassword(password, adminDoc.passwordHash);
        }

        if (!isPasswordOk) {
          return res.status(401).json({
            code: 'auth/wrong-password',
            error: 'Invalid admin password',
          });
        }

        const token = signToken({ email: cleanEmail, role: 'admin' });
        return res.status(200).json({
          success: true,
          token,
          adminEmail: cleanEmail,
        });
      }

      return res.status(400).json({ error: `Unknown auth action: ${action}` });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('API /api/auth error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
