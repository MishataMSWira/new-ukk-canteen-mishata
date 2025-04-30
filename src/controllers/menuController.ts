import { Request, Response } from "express";
import { JENIS, PrismaClient } from "@prisma/client";
import { number } from "joi";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

interface AuthRequest extends Request {
    user?: {
      userId: number;
      username: string;
      role: string;
      id_stan: number;
    };
  }
  

export const getAllMenu = async (request: Request, response: Response) => {
    try {
        const menus = await prisma.menu.findMany({
          include : {
            MenuDiskon: {
              include : {diskon_detail : true}
            }
          }
        })

        const menusWithDiscount = menus.map(menu => {
            let hargaSetelahDiskon = menu.harga;
      
            menu.MenuDiskon.forEach(({ diskon_detail }) => {
              const now = new Date();
              if (now >= diskon_detail.tanggal_awal && now <= diskon_detail.tanggal_akhir) {
                hargaSetelahDiskon -= (hargaSetelahDiskon * diskon_detail.persentase_diskon) / 100;
              }
            });
      
            return { 
              id: menu.id,
              namaMakanan: menu.nama_makanan,
              hargaAsli: menu.harga,
              hargaSetelahDiskon,
              jenis: menu.jenis,
              foto: menu.foto,
              deskripsi: menu.deskripsi,
              id_stan: menu.id_stan
            };
          });
      
          response.json(menusWithDiscount);
        
      } catch (error) {
        return response
        .json({
          status : false,
          message: `There is an error. ${error}`
        })
        .status(400)
      }
    }

    export const createMenu = async (request: AuthRequest, response: Response) => {
        try {
          const { nama_makanan, harga, jenis, deskripsi } = request.body;
          const id_stan = request.user?.id_stan;
          if (!id_stan) return response.status(401).json({ message: "Unauthorized" });
      
          let filename = "";
          if (request.file) filename = request.file.filename;
      
          const newMenu = await prisma.menu.create({
            data: {
              nama_makanan,
              harga: Number(harga),
              jenis,
              foto: filename,
              deskripsi,
              id_stan,
            },
            include: { stan_detail: true },
          });
      
          return response.status(200).json({
            status: true,
            data: newMenu,
            message: `New Menu has been created`,
          });
        } catch (error) {
          return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`,
          });
        }
      };
      

      export const updateMenu = async (request: AuthRequest, response: Response) => {
        try {
          const { id } = request.params;
          const { nama_makanan, harga, jenis, deskripsi } = request.body;
          const id_stan = request.user?.id_stan;
          if (!id_stan) return response.status(401).json({ message: "Unauthorized" });
      
          const findMenu = await prisma.menu.findFirst({
            where: {
              id: Number(id),
              id_stan,
            },
          });
      
          if (!findMenu) {
            return response.status(403).json({
              status: false,
              message: `Access denied or menu not found`,
            });
          }
      
          let filename = findMenu.foto;
          if (request.file) {
            filename = request.file.filename;
            let path = `${BASE_URL}/public/foto-makanan/${findMenu.foto}`;
            let exists = fs.existsSync(path);
            if (exists && findMenu.foto !== ``) fs.unlinkSync(path);
          }
      
          const updatedMenu = await prisma.menu.update({
            data: {
              nama_makanan: nama_makanan || findMenu.nama_makanan,
              harga: harga ? Number(harga) : findMenu.harga,
              jenis: jenis || findMenu.jenis,
              foto: filename,
              deskripsi: deskripsi || findMenu.deskripsi,
            },
            where: { id: Number(id) },
            include: { stan_detail: true },
          });
      
          return response.status(200).json({
            status: true,
            data: updatedMenu,
            message: `Menu has been updated`,
          });
        } catch (error) {
          return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`,
          });
        }
      };
      

      export const dropMenu = async (request: AuthRequest, response: Response) => {
        try {
          const { id } = request.params;
          const id_stan = request.user?.id_stan;
          if (!id_stan) return response.status(401).json({ message: "Unauthorized" });
      
          const findMenu = await prisma.menu.findFirst({
            where: {
              id: Number(id),
              id_stan,
            },
          });
      
          if (!findMenu) {
            return response.status(403).json({
              status: false,
              message: `Access denied or menu not found`,
            });
          }
      
          let path = `${BASE_URL}/public/foto-makanan/${findMenu.foto}`;
          let exists = fs.existsSync(path);
          if (exists && findMenu.foto !== ``) fs.unlinkSync(path);
      
          const deletedMenu = await prisma.menu.delete({
            where: { id: Number(id) },
          });
      
          return response.status(200).json({
            status: true,
            data: deletedMenu,
            message: `Menu has been deleted`,
          });
        } catch (error) {
          return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`,
          });
        }
      };
      