import { Request, Response, } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";
import { text } from "stream/consumers";


const prisma = new PrismaClient({ errorFormat: "pretty" })

interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
        role: string;
    };
  }

export const getAllSiswa = async (request: AuthRequest, response: Response) => {
    try {
      const page = Number(request.query.page) || 1;
      const qty = Number(request.query.qty) || 10;
      const keyword = request.query.keyword?.toString() || "";
  
      const userLogin = request.user;
  
      if (userLogin?.role !== "admin_stan") {
        return response.status(403).json({ status: false, message: "Access denied" });
      }
  
      const siswaList = await prisma.siswa.findMany({
        where: {
          users: {
            id_stan: userLogin.userId, // pastikan userLogin.userId adalah ID si admin_stan
          },
        },
        skip: (page - 1) * qty,
        take: qty,
        orderBy: { id: "asc" },
        include: {
          users: {
            select: {
              username: true,
              id_stan: true,
            },
          },
        },
      });
  
      return response.status(200).json({
        status: true,
        data: siswaList,
        message: `Siswa berhasil diambil`,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: `There is an error. ${error}`,
      });
    }
  };
  

export const createSiswa = async (request: Request, response: Response) => {
    try {
        const { username, password, nama_siswa, alamat, telp } = request.body /** get requested data (data has been sent from request) */
        
        let filename = ""
        if (request.file) filename = request.file.filename
        
        // Step 1: Buat user baru
    const newUser = await prisma.users.create({
        data: {
          username,
          password,
          role: "siswa", // pastikan ini sesuai enum ROLE di schema kamu
        },
      });
  
      // Step 2: Buat siswa dan hubungkan ke user
      const newSiswa = await prisma.siswa.create({
        data: {
          nama_siswa,
          alamat,
          telp,
          foto: filename,
          id_user: newUser.id,
        },
      });
  
      return response.status(200).json({
        status: true,
        data: {
          user: newUser,
          siswa: newSiswa,
        },
        message: `New Siswa has been created`,
      });
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateSiswa = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { nama_siswa, alamat, telp } = request.body;
      const userLogin = request.user;
  
      const findSiswa = await prisma.siswa.findFirst({
        where: {
          id: Number(id),
          users: {
            id_stan: userLogin?.userId,
          },
        },
        include: { users: true },
      });
  
      if (!findSiswa) {
        return response.status(404).json({ status: false, message: `Siswa not found or access denied` });
      }
  
      let filename = findSiswa.foto;
      if (request.file) {
        filename = request.file.filename;
        const path = `./public/foto-siswa/${findSiswa.foto}`;
        if (fs.existsSync(path) && findSiswa.foto !== "") fs.unlinkSync(path);
      }
  
      const updatedSiswa = await prisma.siswa.update({
        where: { id: Number(id) },
        data: {
          nama_siswa: nama_siswa || findSiswa.nama_siswa,
          alamat: alamat || findSiswa.alamat,
          telp: telp || findSiswa.telp,
          foto: filename,
        },
      });
  
      return response.status(200).json({
        status: true,
        data: updatedSiswa,
        message: `Siswa updated successfully`,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: `There is an error. ${error}`,
      });
    }
  };
  

  export const dropSiswa = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const userLogin = request.user;
  
      const findSiswa = await prisma.siswa.findFirst({
        where: {
          id: Number(id),
          users: {
            id_stan: userLogin?.userId,
          },
        },
        include: { users: true },
      });
  
      if (!findSiswa) {
        return response.status(404).json({ status: false, message: `Siswa not found or access denied` });
      }
  
      const path = `./public/foto-siswa/${findSiswa.foto}`;
      if (fs.existsSync(path) && findSiswa.foto !== "") fs.unlinkSync(path);
  
      // delete siswa
      const deletedSiswa = await prisma.siswa.delete({
        where: { id: Number(id) },
      });
  
      // delete user-nya juga jika perlu
      if (findSiswa.id_user) {
        await prisma.users.delete({
          where: { id: findSiswa.id_user },
        });
      }
  
      return response.status(200).json({
        status: true,
        data: deletedSiswa,
        message: `Siswa deleted successfully`,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: `There is an error. ${error}`,
      });
    }
  };
  