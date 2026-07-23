"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetOTP = exports.forgotPassword = exports.resendOTP = exports.verifyEmail = exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const otp_1 = require("../utils/otp");
const emailService_1 = require("../services/emailService");
// ================= REGISTER =================
const register = async (req, res) => {
    const parsed = validation_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.errors,
        });
    }
    const { name, email, phone, password, } = parsed.data;
    const emailExists = await database_1.default.user.findUnique({
        where: { email },
    });
    if (emailExists) {
        return res.status(400).json({
            success: false,
            message: "Email already registered",
        });
    }
    const phoneExists = await database_1.default.user.findFirst({
        where: { phone },
    });
    if (phoneExists) {
        return res.status(400).json({
            success: false,
            message: "Phone already registered",
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await database_1.default.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword,
        },
    });
    const otp = (0, otp_1.generateOTP)();
    console.log("Generated OTP:", otp);
    console.log("User Email:", user.email);
    await database_1.default.emailOTP.deleteMany({
        where: {
            email: user.email,
        },
    });
    await database_1.default.emailOTP.create({
        data: {
            email: user.email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    await (0, emailService_1.sendVerificationEmail)(user.email, user.name, otp);
    return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
        email: user.email,
    });
};
exports.register = register;
// ================= LOGIN =================
const login = async (req, res) => {
    const parsed = validation_1.userLoginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.errors,
        });
    }
    const { email, password } = parsed.data;
    const user = await database_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !user.password) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    if (!user.isVerified) {
        const otp = (0, otp_1.generateOTP)();
        await database_1.default.emailOTP.deleteMany({
            where: {
                email: user.email,
            },
        });
        await database_1.default.emailOTP.create({
            data: {
                email: user.email,
                otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await (0, emailService_1.sendVerificationEmail)(user.email, user.name, otp);
        return res.status(401).json({
            success: false,
            message: "Please verify your email first.",
        });
    }
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    const token = (0, jwt_1.generateToken)({
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
exports.login = login;
// ================= LOGOUT =================
const logout = async (_req, res) => {
    res.clearCookie("user_token");
    res.json({
        success: true,
        message: "Logged out successfully",
    });
};
exports.logout = logout;
// ================= PROFILE =================
const getProfile = async (req, res) => {
    const user = await database_1.default.user.findUnique({
        where: {
            id: req.user.id,
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
exports.getProfile = getProfile;
// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
    const { name, phone } = req.body;
    const updated = await database_1.default.user.update({
        where: {
            id: req.user.id,
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
exports.updateProfile = updateProfile;
// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, } = req.body;
    const user = await database_1.default.user.findUnique({
        where: {
            id: req.user.id,
        },
    });
    if (!user || !user.password) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    const match = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!match) {
        return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await database_1.default.user.update({
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
exports.changePassword = changePassword;
// ============== VERIFY EMAIL =================
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    const record = await database_1.default.emailOTP.findFirst({
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
    await database_1.default.user.update({
        where: { email },
        data: {
            isVerified: true,
        },
    });
    await database_1.default.emailOTP.deleteMany({
        where: {
            email,
        },
    });
    return res.json({
        success: true,
        message: "Email verified successfully.",
    });
};
exports.verifyEmail = verifyEmail;
// ============== RESEND OTP =================
const resendOTP = async (req, res) => {
    const { email } = req.body;
    const user = await database_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    const otp = (0, otp_1.generateOTP)();
    await database_1.default.emailOTP.deleteMany({
        where: {
            email,
        },
    });
    await database_1.default.emailOTP.create({
        data: {
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    await (0, emailService_1.sendVerificationEmail)(user.email, user.name, otp);
    return res.json({
        success: true,
        message: "OTP sent successfully.",
    });
};
exports.resendOTP = resendOTP;
// ============== FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await database_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Email not registered"
        });
    }
    const otp = (0, otp_1.generateOTP)();
    await database_1.default.emailOTP.deleteMany({
        where: {
            email
        }
    });
    await database_1.default.emailOTP.create({
        data: {
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
    });
    await (0, emailService_1.sendVerificationEmail)(user.email, user.name, otp);
    res.json({
        success: true,
        message: "Reset OTP sent to email",
        email
    });
};
exports.forgotPassword = forgotPassword;
// ============== VERIFY RESET OTP =================
const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    const record = await database_1.default.emailOTP.findFirst({
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
    return res.json({
        success: true,
        message: "OTP verified successfully",
    });
};
exports.verifyResetOTP = verifyResetOTP;
// ============== RESET PASSWORD =================
const resetPassword = async (req, res) => {
    const { email, password, } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }
    const user = await database_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    await database_1.default.user.update({
        where: {
            email,
        },
        data: {
            password: hashedPassword,
        },
    });
    // remove old OTP
    await database_1.default.emailOTP.deleteMany({
        where: {
            email,
        },
    });
    return res.json({
        success: true,
        message: "Password reset successfully",
    });
};
exports.resetPassword = resetPassword;
