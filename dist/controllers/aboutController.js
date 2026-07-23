"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAbout = exports.getAbout = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get About Page
const getAbout = async (req, res) => {
    try {
        const about = await database_1.default.about.findFirst({
            orderBy: { id: "asc" },
        });
        return res.status(200).json({
            success: true,
            data: about,
        });
    }
    catch (error) {
        console.log("ABOUT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch About page.",
        });
    }
};
exports.getAbout = getAbout;
// Create / Update About Page
const saveAbout = async (req, res) => {
    try {
        const { title, tagline, story, mission, vision, address, phone, email, whatsapp, image, } = req.body;
        const existing = await database_1.default.about.findFirst();
        let about;
        if (existing) {
            about = await database_1.default.about.update({
                where: {
                    id: existing.id,
                },
                data: {
                    title,
                    tagline,
                    story,
                    mission,
                    vision,
                    address,
                    phone,
                    email,
                    whatsapp,
                    image,
                },
            });
        }
        else {
            about = await database_1.default.about.create({
                data: {
                    title,
                    tagline,
                    story,
                    mission,
                    vision,
                    address,
                    phone,
                    email,
                    whatsapp,
                    image,
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "About page updated successfully.",
            data: about,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to save About page.",
        });
    }
};
exports.saveAbout = saveAbout;
