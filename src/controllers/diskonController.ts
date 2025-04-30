import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
    id_stan: number;
  };
}

export const getAllDiskon = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 10;
    const keyword = request.query.keyword?.toString() || "";
    const dataDiskon = await prisma.diskon.findMany({
      take: qty, // mendefinisikan jml data yg diambil
      skip: (page - 1) * qty,
      orderBy: { id: "asc" },
      include : {MenuDiskon : true}
    });
    return response
      .json({
        status: true,
        data: dataDiskon,
        message: `Diskon has retrieved`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const createDiskon = async (request: AuthRequest, response: Response) => {
  try {
    if (request.user?.role !== 'admin_stan') {
      return response.status(403).json({ status: false, message: "Unauthorized" });
    }

    const adminId = request.user.userId;

    // Cek id_stan milik admin_stan ini
    const stan = await prisma.stan.findFirst({
      where: { id_user: adminId }
    });

    if (!stan) {
      return response.status(404).json({ status: false, message: "Stan not found for this admin" });
    }

    const {
      nama_diskon,
      persentase_diskon,
      tanggal_awal,
      tanggal_akhir,
      menuIds
    } =
      request.body; /** get requested data (data has been sent from request) */

    /** process to save new egg */
    const newDiskon = await prisma.diskon.create({
      data: {
        id_stan: stan.id,
        nama_diskon,
        persentase_diskon: Number(persentase_diskon),
        tanggal_awal: new Date(tanggal_awal).toISOString(),
        tanggal_akhir: new Date(tanggal_akhir).toISOString(),
        MenuDiskon: {
          create: menuIds.map((id_menu : Number) => ({
            id_menu
          }))
        }
      },
      include: { MenuDiskon: true },
    });
    /** price and stock have to convert in number type */

    return response
      .json({
        status: true,
        data: newDiskon,
        message: `New Diskon has created`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const updateDiskon = async (request: AuthRequest, response: Response) => {
  try {
    if (request.user?.role !== 'admin_stan') {
      return response.status(403).json({ status: false, message: "Unauthorized" });
    }

    const id_stan = request.user.userId;

  

    
    const { id } =
    request.params; /** get id of egg's id that sent in parameter of URL */
    const {
      nama_diskon,
      persentase_diskon,
      tanggal_awal,
      tanggal_akhir,
      menuIds
    } =
    request.body; /** get requested data (data has been sent from request) */
    
    /** make sure that data is exists in database */
    const findDiskon = await prisma.diskon.findFirst({
      where: { id: Number(id), id_stan },
    });
    if (!findDiskon) {
      return response.status(404).json({ status: false, message: "Stan or Diskon not found for this admin" });
    }
    /** process to update egg's data */
    const updatedDiskon = await prisma.diskon.update({
      data: {
        nama_diskon: nama_diskon || findDiskon.nama_diskon,
        persentase_diskon: persentase_diskon || findDiskon.persentase_diskon,
        tanggal_awal: tanggal_awal || findDiskon.tanggal_awal,
        tanggal_akhir: tanggal_akhir || findDiskon.tanggal_akhir,
        MenuDiskon: {
          create: menuIds.map((id_menu : Number) => ({
            id_menu
          }))
        }
      },
      where: { id: Number(id) },
      include: { stan_detail: true },
    });

    return response
      .json({
        status: true,
        data: updatedDiskon,
        message: `Diskon has been updated`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const dropDiskon = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    /** make sure that data is exists in database */
    if (request.user?.role !== 'admin_stan') {
      return response.status(403).json({ status: false, message: "Unauthorized" });
    }

    const id_stan = request.user.userId;

    // Cek id_stan milik admin_stan ini
    const dropDiskon = await prisma.diskon.findFirst({
      where: { id: Number(id), id_stan }
    });

    if (!dropDiskon) {
      return response.status(404).json({ status: false, message: "Stan or Diskon not found for this admin" });
    }

    /** process to delete egg's data */
    const deletedDiskon = await prisma.diskon.delete({
      where: { id: Number(id) },
    });
    return response
      .json({
        status: true,
        data: deletedDiskon,
        message: `Diskon has been deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};


