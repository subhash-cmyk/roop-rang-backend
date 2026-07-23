"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`\n  💄 Roop Rang API running at http://localhost:${PORT}\n  Docs: http://localhost:${PORT}/api-docs\n`);
});
process.on('SIGTERM', async () => { server.close(async () => { await database_1.default.$disconnect(); process.exit(0); }); });
