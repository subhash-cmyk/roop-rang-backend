"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const validation_1 = require("../utils/validation");
// ================= Get All Users =================
const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search || "");
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                    },
                },
                {
                    email: {
                        contains: search,
                    },
                },
            ];
        }
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            database_1.default.user.count({
                where,
            }),
        ]);
        res.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load users",
        });
    }
};
exports.getUsers = getUsers;
// ================= Get Single User =================
const getUser = async (req, res) => {
    try {
        const user = await database_1.default.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
exports.getUser = getUser;
// ================= Create User =================
const createUser = async (req, res) => {
    try {
        const parsed = validation_1.userSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.errors,
            });
        }
        const user = await database_1.default.user.create({
            data: parsed.data,
        });
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
};
exports.createUser = createUser;
// ================= Update User =================
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await database_1.default.user.update({
            where: {
                id,
            },
            data: req.body,
        });
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};
exports.updateUser = updateUser;
// ================= Delete User =================
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await database_1.default.user.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};
exports.deleteUser = deleteUser;
