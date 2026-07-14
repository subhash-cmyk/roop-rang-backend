import { Request, Response } from "express";
import prisma from "../config/prisma";

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
    const { image, badgeText, title } = req.body;

    const existingHero = await prisma.heroBanner.findFirst();

    let hero;

    if (existingHero) {
      hero = await prisma.heroBanner.update({
        where: {
          id: existingHero.id,
        },
        data: {
          image,
          badgeText,
          title,
        },
      });
    } else {
      hero = await prisma.heroBanner.create({
        data: {
          image,
          badgeText,
          title,
        },
      });
    }

    res.json(hero);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Hero update failed",
    });
  }
};