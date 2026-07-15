import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import offerRoutes from './routes/offerRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import contactRoutes from './routes/contactRoutes';
import privacyRoutes from './routes/privacyRoutes';
import termsRoutes from './routes/termsRoutes';
import settingsRoutes from './routes/settingsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import heroRoutes from "./routes/heroRoutes";
import heroUploadRoutes from "./routes/heroUploadRoutes";
import visitorRoutes from "./routes/visitorRoutes";
import userAuthRoutes from "./routes/userAuthRoutes";

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/api/visitor",visitorRoutes);
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', rateLimit({ windowMs:15*60*1000, max:300 }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (_req,res)=> res.json({ status:'ok', service:'Roop Rang API', timestamp:new Date().toISOString() }));

app.get('/api', (_req,res)=> res.json({ message:'Roop Rang Cosmetics API v1.0', docs:'/api-docs' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Roop Rang API is running'
  });
});

app.use('/api/admin', authRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/user", userAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/privacy-policy', privacyRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/upload/hero', heroUploadRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
