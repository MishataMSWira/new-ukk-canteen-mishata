import { NextFunction, request, Request, response, Response } from "express";
import { allow } from "joi";
import { verify } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
        role: string;
        id_siswa?: number;
        id_stan?: number;
    };
  }

  export const authenticate = async (
    request: AuthRequest,
    response: Response,
    next: NextFunction
  ) => {
    const token = request.headers["authorization"]?.split(" ")[1];
  
    if (!token) {
      return response.status(401).json({ error: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN!);
  
      console.log("Decoded token:", decoded);
  
      if (!decoded || typeof decoded === "string" || !decoded.userId) {
        return response
          .status(401)
          .json({ message: "Token tidak valid atau userId tidak ada" });
      }
  
      // fetch db untuk ambil detail user
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          role: true,
          siswa: {
            select: {
              id: true,
            },
          },
          stan: {
            select: {
              id: true,
            },
          },
        },
      });
  
      if (!user) {
        return response.status(401).json({ error: "Invalid token" });
      }
  
      request.user = {
        userId: user.id,
        username: user.username,
        role: user.role,
        id_siswa: user.siswa?.id,
        id_stan: user.stan?.id, // <-- TAMBAHKAN INI
      };
  
      console.log("[AUTH] User berhasil login:", request.user);
      next();
    } catch (error) {
      console.error(`[AUTHENTICATE] ${error}`);
      response.status(401).json({ error: "Unauthorized" });
    }
  };
  

export const authorize = (allowedRoles: any) => {
    return (request: AuthRequest, response: Response, next: NextFunction) => {

      console.log("[AUTHORIZE] User:", request.user);
console.log("[AUTHORIZE] Allowed Roles:", allowedRoles);

        if (!request.user || !allowedRoles.includes(request.user.role)) {
            return response.status(403).json({ message: "Akses ditolak" });
          }
  
      next();
    };
  };

  