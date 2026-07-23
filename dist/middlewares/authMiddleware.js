"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = await database_1.default.admin.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        next();
    };
};
exports.authorize = authorize;
