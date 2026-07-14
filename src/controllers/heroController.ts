import { Request, Response } from "express";
import prisma from "../config/prisma";


export const deleteHero = async (
  req: Request,
  res: Response
) => {
  await prisma.heroBanner.deleteMany();

  res.json({
    success: true,
    message: "Hero Banner deleted"
  });
};


export const getHero = async(
 req:Request,
 res:Response
)=>{

 const hero = await prisma.heroBanner.findFirst();

 res.json(hero);

}



export const updateHero = async (
 req: Request,
 res: Response
) => {

 try {

 const {image,badgeText,title}=req.body;

 await prisma.heroBanner.deleteMany();

 const hero = await prisma.heroBanner.create({
   data:{
    image,
    badgeText,
    title
   }
 });

 res.json(hero);

 } catch(error){
   res.status(500).json({
     message:"Hero update failed"
   });
 }

};