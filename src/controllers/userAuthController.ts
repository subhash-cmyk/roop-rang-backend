import { Request, Response } from "express";
import prisma from "../config/database";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import {
  registerSchema,
  userLoginSchema,
} from "../utils/validation";
import { AuthRequest } from "../middlewares/userAuthMiddleware";
import { generateOTP } from "../utils/otp";
import { sendVerificationEmail } from "../services/emailService";

// ================= REGISTER =================

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors,
    });
  }

  const {
    name,
    email,
    phone,
    password,
  } = parsed.data;

  const emailExists = await prisma.user.findUnique({
    where: { email },
  });

  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const phoneExists = await prisma.user.findFirst({
    where: { phone },
  });

  if (phoneExists) {
    return res.status(400).json({
      success: false,
      message: "Phone already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    },
  });

  const otp = generateOTP();

  await prisma.emailOTP.deleteMany({
    where: {
      email: user.email,
    },
  });

  await prisma.emailOTP.create({
    data: {
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendVerificationEmail(
    user.email,
    user.name,
    otp
  );

  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    email: user.email,
  });
}
  // ================= LOGIN =================

  export const login = async (req: Request, res: Response) => {
    const parsed = userLoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors,
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: "rider",
    });

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  };

  // ================= LOGOUT =================

  export const logout = async (
    _req: Request,
    res: Response
  ) => {
    res.clearCookie("user_token");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  };

  // ================= PROFILE =================

  export const getProfile = async (
    req: AuthRequest,
    res: Response
  ) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  };

  // ================= UPDATE PROFILE =================

  export const updateProfile = async (
    req: AuthRequest,
    res: Response
  ) => {
    const { name, phone } = req.body;

    const updated = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        name,
        phone,
      },
    });

    res.json({
      success: true,
      data: updated,
    });
  };

  // ================= CHANGE PASSWORD =================

  export const changePassword = async (
    req: AuthRequest,
    res: Response
  ) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
    });

    if (!user || !user.password) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  };

  // ============== VERIFY EMAIL =================
  export const verifyEmail = async (
    req: Request,
    res: Response
  ) => {
    const { email, otp } = req.body;

    const record = await prisma.emailOTP.findFirst({
      where: {
        email,
        otp,
      },
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });

    await prisma.emailOTP.deleteMany({
      where: {
        email,
      },
    });

    return res.json({
      success: true,
      message: "Email verified successfully.",
    });
  };


  // ============== RESEND OTP =================
  export const resendOTP = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    await prisma.emailOTP.deleteMany({
      where: {
        email,
      },
    });

    await prisma.emailOTP.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(
      user.email,
      user.name,
      otp
    );

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  };