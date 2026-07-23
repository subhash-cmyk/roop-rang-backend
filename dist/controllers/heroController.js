"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHero = exports.getHero = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getHero = async (req, res) => {
    const hero = await prisma_1.default.heroBanner.findFirst();
    res.json(hero);
};
exports.getHero = getHero;
const updateHero = async (req, res) => {
    try {
        const { image, badgeText, title } = req.body;
        const existingHero = await prisma_1.default.heroBanner.findFirst();
        let hero;
        if (existingHero) {
            hero = await prisma_1.default.heroBanner.update({
                where: {
                    id: existingHero.id,
                },
                data: {
                    image,
                    badgeText,
                    title,
                },
            });
        }
        else {
            hero = await prisma_1.default.heroBanner.create({
                data: {
                    image,
                    badgeText,
                    title,
                },
            });
        }
        res.json(hero);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Hero update failed",
        });
    }
};
exports.updateHero = updateHero;
