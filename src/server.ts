import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import prisma from './config/database';
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n  💄 Roop Rang API running at http://localhost:${PORT}\n  Docs: http://localhost:${PORT}/api-docs\n`);
});
process.on('SIGTERM', async ()=>{ server.close(async()=>{ await prisma.$disconnect(); process.exit(0); }); });
