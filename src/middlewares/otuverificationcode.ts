import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5"
import { sign } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { error } from "console";
import { nanoid } from "nanoid";
import { addDays } from "date-fns";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const generateVerificationCode = async (req: Request, res: Response) => {
    try {
      const { id_user } = req.body; // misal ambil dari token atau frontend
  
      const kodeBaru = nanoid(20);
      const kadaluarsa = addDays(new Date(), 1); // berlaku 10 menit
  
      await prisma.users.update({
        where: { id: id_user },
        data: {
          kode_verifikasi: kodeBaru,
          verifikasi_exp: kadaluarsa,
        },
      });
  
      return res.json({
        status: true,
        message: "Kode verifikasi berhasil dibuat",
        kode_verifikasi: kodeBaru,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: `Terjadi kesalahan: ${err}`,
      });
    }
  };
  