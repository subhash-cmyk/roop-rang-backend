"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrivacy = exports.updatePrivacy = exports.createPrivacy = exports.listPrivacy = exports.getPrivacy = void 0;
const database_1 = __importDefault(require("../config/database"));
const slugify_1 = require("../utils/slugify");
const getPrivacy = async (_req, res) => {
    const data = await database_1.default.privacyPolicy.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
    res.json({ success: true, data });
};
exports.getPrivacy = getPrivacy;
const listPrivacy = async (_req, res) => {
    const data = await database_1.default.privacyPolicy.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
};
exports.listPrivacy = listPrivacy;
const createPrivacy = async (req, res) => {
    const { title, content, version } = req.body;
    const policy = await database_1.default.privacyPolicy.create({ data: { title, content, version: version || '1.0', slug: (0, slugify_1.slugify)(title) + '-' + Date.now(), isActive: true } });
    res.status(201).json({ success: true, data: policy });
};
exports.createPrivacy = createPrivacy;
const updatePrivacy = async (req, res) => {
    const policy = await database_1.default.privacyPolicy.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json({ success: true, data: policy });
};
exports.updatePrivacy = updatePrivacy;
const deletePrivacy = async (req, res) => {
    await database_1.default.privacyPolicy.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
};
exports.deletePrivacy = deletePrivacy;
