"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.getContacts = exports.createContact = void 0;
const database_1 = __importDefault(require("../config/database"));
const createContact = async (req, res) => {
    const contact = await database_1.default.contact.create({ data: req.body });
    res.status(201).json({ success: true, data: contact, message: 'Message sent!' });
};
exports.createContact = createContact;
const getContacts = async (_req, res) => {
    const data = await database_1.default.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
};
exports.getContacts = getContacts;
const deleteContact = async (req, res) => {
    await database_1.default.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Deleted' });
};
exports.deleteContact = deleteContact;
