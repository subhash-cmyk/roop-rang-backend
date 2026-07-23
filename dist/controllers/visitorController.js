"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitors = exports.addVisitor = void 0;
const database_1 = __importDefault(require("../config/database"));
const addVisitor = async (req, res) => {
    try {
        await database_1.default.visitor.create({
            data: {
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            }
        });
        res.json({
            success: true,
            message: "Visitor tracked"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Visitor tracking failed"
        });
    }
};
exports.addVisitor = addVisitor;
const getVisitors = async (req, res) => {
    try {
        const count = await database_1.default.visitor.count();
        res.json({
            success: true,
            visitors: count
        });
    }
    catch (error) {
        res.status(500).json({
            success: false
        });
    }
};
exports.getVisitors = getVisitors;
