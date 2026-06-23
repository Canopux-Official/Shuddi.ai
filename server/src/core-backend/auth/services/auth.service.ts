import { prisma } from '../../../lib/prisma';
import { VerificationType } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers';
import { generateSecureOtp, sendOtpEmail } from '../utils/otpUtils';
import { verifyGoogleToken } from '../utils/googleUtils';
import { ApiError } from '../../dashboard/utils/ApiError';

interface OnboardingData {
  username: string;
  country: string;
  state: string;
  city: string;
}

export const AuthService = {

  async registerUser(email: string, pass: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const passwordHash = await hashPassword(pass);

    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        role: 'CITIZEN', 
        emailVerified: false 
      }
    });

    const otpCode = generateSecureOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otpCode,
        type: VerificationType.EMAIL_VERIFICATION,
        expiresAt
      }
    });

    await sendOtpEmail(email, otpCode);
    return { message: "User created. OTP sent." };
  },

  async verifyUserOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const validOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: VerificationType.EMAIL_VERIFICATION,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validOtp) throw new Error("Invalid or expired OTP");

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } }),
      prisma.otp.deleteMany({ where: { userId: user.id, type: VerificationType.EMAIL_VERIFICATION } })
    ]);

    const token = generateToken(user.id, user.email, user.role);
    return {
      token,
      user: { id: user.id, email: user.email },
      message: "Verified successfully"
    };
  },

  async handleGoogleAuth(idToken: string) {
    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser || !googleUser.email) {
      throw new Error("Google authentication failed");
    }

    const email = googleUser.email;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: null, 
          role: 'CITIZEN',
          emailVerified: true 
        }
      });
    } else {
      if (!user.emailVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true }
        });
      }
    }

    const token = generateToken(user.id, user.email, user.role);
    
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

    return {
      token,
      isOnboarded: !!profile,
      hasPassword: !!user.passwordHash,
      user: { id: user.id, email: user.email, role: user.role },
      message: "Google authentication successful"
    };
  },

 async authenticateUser(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) throw new Error("Invalid credentials");


    if (!user.passwordHash) {
      throw new Error("Please login with Google");
    }

    const isValid = await comparePassword(pass, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    const token = generateToken(user.id, user.email, user.role);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });


    return {
      token,
      isOnboarded: !!profile,
      hasPassword: !!user.passwordHash,
      user: { id: user.id, email: user.email, role: user.role },
      message: "Login successful"
    };
  },

  async resendUserOtp(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otpCode = generateSecureOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction([
      prisma.otp.deleteMany({ where: { userId: user.id, type: VerificationType.EMAIL_VERIFICATION } }),
      prisma.otp.create({
        data: {
          userId: user.id,
          code: otpCode,
          type: VerificationType.EMAIL_VERIFICATION,
          expiresAt
        }
      })
    ]);

    await sendOtpEmail(email, otpCode);
    return { message: "OTP resent." };
  },

  async onboardUser(userId: string, data: OnboardingData) {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new Error("User already onboarded");
    }

    const existingUsername = await prisma.profile.findUnique({ where: { username: data.username } });
    if (existingUsername) throw new Error("Username already taken");

    await prisma.$transaction(async (tx) => {
      await tx.profile.create({
        data: {
          userId,
          username: data.username,
          country: data.country,
          state: data.state,
          city: data.city,
        }
      });

      await tx.userStats.create({
        data: { 
          userId, 
          xp: 0, 
          level: 1,
          totalContributions: 0,
          engagementLevel: 0.0,
          currentStreak: 0,
          longestStreak: 0,
          rewardPoints: 0,
          totalWeightRemoved: 0.0
        }
      });
    });

    return { message: "Onboarding complete" };
  },

  async createPassword(userId: string, password: string) {
   const user = await prisma.user.findUnique({ where: { id: userId } });
  
   if (!user) throw new ApiError(404, "User not found");
  
   if(user.passwordHash) {
     throw new ApiError(400, "Password already set. Use change password instead.");
   }
  
   const passwordHash = await hashPassword(password);
  
   await prisma.user.update({
     where: {
       id: userId,
     },
     data: {
       passwordHash,
     },
   });
  
   return {
     message: "Password created successfully",
   };
  }
};
