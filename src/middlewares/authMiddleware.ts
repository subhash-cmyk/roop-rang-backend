import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
    role: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (!admin) {
      return res.status(401).json({
        success:false,
        message:"Admin not found"
      });
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();

  } catch(error) {
    return res.status(401).json({
      success:false,
      message:"Invalid token"
    });
  }
};


export const authorize = (...roles:string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    if(!req.admin || !roles.includes(req.admin.role)){
      return res.status(403).json({
        success:false,
        message:"Forbidden"
      });
    }

    next();
  };
};