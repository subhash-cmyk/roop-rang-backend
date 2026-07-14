import { Request, Response } from "express";
import prisma from "../config/database";


export const addVisitor = async (
  req: Request,
  res: Response
) => {

  try {

    await prisma.visitor.create({
      data:{
        ip:req.ip,
        userAgent:req.headers["user-agent"]
      }
    });


    res.json({
      success:true,
      message:"Visitor tracked"
    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Visitor tracking failed"
    });

  }

};



export const getVisitors = async (
  req: Request,
  res: Response
) => {

  try{

    const count = await prisma.visitor.count();


    res.json({
      success:true,
      visitors:count
    });


  }catch(error){

    res.status(500).json({
      success:false
    });

  }

};