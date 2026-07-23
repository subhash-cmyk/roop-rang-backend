"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const database_1 = __importDefault(require("../config/database"));
const getSettings = async (_req, res) => {
    try {
        let settings = await database_1.default.websiteSetting.findFirst();
        if (!settings) {
            settings = await database_1.default.websiteSetting.create({
                data: {
                    supportEmail: "rangroop@gmail.com",
                    supportPhone: "+91 7096241594",
                    address: "Shop No 521, Apex Building, Madhuram Circle, Dindoli, Surat, Gujarat – 394210",
                    currency: "INR",
                    taxRate: 18,
                    facebook: "https://facebook.com/rooprang",
                    instagram: "https://instagram.com/rooprang",
                    twitter: "",
                    logo: ""
                }
            });
        }
        res.json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get settings"
        });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const existing = await database_1.default.websiteSetting.findFirst();
        const data = {
            supportEmail: req.body.supportEmail,
            supportPhone: req.body.supportPhone,
            address: req.body.address,
            currency: req.body.currency,
            taxRate: Number(req.body.taxRate),
            facebook: req.body.facebook || "",
            instagram: req.body.instagram || "",
            twitter: req.body.twitter || "",
            logo: req.body.logo || ""
        };
        let settings;
        if (existing) {
            settings = await database_1.default.websiteSetting.update({
                where: {
                    id: existing.id
                },
                data
            });
        }
        else {
            settings = await database_1.default.websiteSetting.create({
                data
            });
        }
        res.json({
            success: true,
            message: "Settings updated successfully",
            data: settings
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Settings update failed"
        });
    }
};
exports.updateSettings = updateSettings;
