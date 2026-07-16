import { Request, Response } from "express";
import prisma from "../config/database";


export const getSettings = async (_req: Request, res: Response) => {
  try {

    let settings = await prisma.websiteSetting.findFirst();

    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: {
          supportEmail: "rangroop@gmail.com",
          supportPhone: "+91 7096241594",
          address:
            "Shop No 521, Apex Building, Madhuram Circle, Dindoli, Surat, Gujarat – 394210",

          currency: "INR",
          taxRate: 18,

          facebook: "https://facebook.com/rooprang",
          instagram: "https://instagram.com/rooprang",
          twitter: "",
          logo: ""
        }
      });
    }

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to get settings"
    });
  }
};

export const updateSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const existing = await prisma.websiteSetting.findFirst();

    const data = {
      supportEmail: req.body.supportEmail,
      supportPhone: req.body.supportPhone,
      address: req.body.address,
      currency: req.body.currency,
      taxRate: Number(req.body.taxRate),

      facebook: req.body.facebook || "",
      instagram: req.body.instagram || "",
      twitter: req.body.twitter || "",
      logo: req.body.logo || ""
    };

    let settings;

    if (existing) {
      settings = await prisma.websiteSetting.update({
        where: {
          id: existing.id
        },
        data
      });
    } else {
      settings = await prisma.websiteSetting.create({
        data
      });
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Settings update failed"
    });
  }
};