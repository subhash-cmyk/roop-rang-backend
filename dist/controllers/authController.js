"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.login = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const login = async (req, res) => {
    const parsed = validation_1.loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ success: false, errors: parsed.error.errors });
    const { email, password } = parsed.data;
    const admin = await database_1.default.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive)
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcryptjs_1.default.compare(password, admin.password);
    if (!isMatch)
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = (0, jwt_1.generateToken)({ id: admin.id, email: admin.email, role: admin.role });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
};
exports.login = login;
const logout = async (_req, res) => { res.clearCookie('token'); res.json({ success: true, message: 'Logged out' }); };
exports.logout = logout;
const getProfile = async (req, res) => {
    const admin = await database_1.default.admin.findUnique({ where: { id: req.admin.id }, select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true } });
    res.json({ success: true, data: admin });
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const { name, email, avatar } = req.body;
    const updated = await database_1.default.admin.update({ where: { id: req.admin.id }, data: { name, email, avatar } });
    res.json({ success: true, data: updated });
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await database_1.default.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin)
        return res.status(404).json({ success: false, message: 'Not found' });
    const match = await bcryptjs_1.default.compare(currentPassword, admin.password);
    if (!match)
        return res.status(400).json({ success: false, message: 'Current password incorrect' });
    const hashed = await bcryptjs_1.default.hash(newPassword, 12);
    await database_1.default.admin.update({ where: { id: admin.id }, data: { password: hashed } });
    res.json({ success: true, message: 'Password changed' });
};
exports.changePassword = changePassword;
