"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSKU = exports.slugify = void 0;
const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
exports.slugify = slugify;
const generateSKU = (name) => { const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'R'); const random = Math.floor(10000 + Math.random() * 90000); return `RR-${prefix}-${random}`; };
exports.generateSKU = generateSKU;
