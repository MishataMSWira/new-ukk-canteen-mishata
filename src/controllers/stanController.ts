import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllStan = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
      const qty = Number(request.query.qty) || 10;
      const keyword = request.query.keyword?.toString() || "";
      const dataStan = await prisma.stan.findMany({
        take: qty, // mendefinisikan jml data yg diambil
        skip: (page -1) * qty,
        orderBy: {id_user: "asc"}

      });
        return response.json({
            status: true,
            data: dataStan,
            message: `Stan has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createStan = async (request: Request, response: Response) => {
    try {

        
        const { nama_stan, nama_pemilik, telp, id_user } = request.body /** get requested data (data has been sent from request) */
        
        /** process to save new egg */
        const newStan = await prisma.stan.create({
            data: { nama_stan, nama_pemilik, telp, id_user }
        })

        return response.json({
            status: true,
            data: newStan,
            message: `New Stan has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateStan = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { nama_stan, nama_pemilik, telp, id_user, user_detail } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findStan = await prisma.stan.findFirst({ where: { id: Number(id) } })
        if (!findStan) return response
            .status(200)
            .json({ status: false, message: `Stan is not found` })



        /** process to update egg's data */
        const updatedStan = await prisma.stan.update({
            data: {
                nama_stan: nama_stan || findStan.nama_stan,
                nama_pemilik: nama_pemilik || findStan.nama_pemilik,
                telp: telp || findStan.telp,
                id_user: id_user || findStan.id_user
                
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedStan,
            message: `Stan has been updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

// routes/stan.ts atau controller lain
export const updateStanByVerifikasi = async (req: Request, res: Response) => {
  try {
    const { kode_verifikasi } = req.params;
    const { nama_stan, nama_pemilik, telp } = req.body;

    // Ambil user berdasarkan kode verifikasi
    const user = await prisma.users.findFirst({ where: { kode_verifikasi } });

    if (!user) {
      return res.status(404).json({ status: false, message: "Kode verifikasi tidak ditemukan." });
    }

    // Cek apakah kode sudah expired
    const now = new Date();
    if (!user.verifikasi_exp || now > user.verifikasi_exp) {
      return res.status(403).json({ status: false, message: "Kode verifikasi sudah kedaluwarsa." });
    }

    // ✅ Tambahkan validasi jika user sedang login:
    const tokenUserId = (req as any).user?.id; // jika pakai middleware auth JWT
    if (tokenUserId && tokenUserId !== user.id) {
      return res.status(403).json({ status: false, message: "Kode verifikasi bukan milik Anda." });
    }

   // 2. Pastikan user memiliki relasi ke stan
if (!user.id_stan) {
  return res.status(400).json({
    status: false,
    message: "User tidak memiliki data stan untuk diperbarui.",
  });
}

// 3. Update data Stan
const updatedStan = await prisma.stan.update({
  where: {
    id: user.id_stan, // pasti number sekarang
  },
  data: {
    nama_stan,
    nama_pemilik,
    telp,
  },
});


    // 3. Hapus kode verifikasi agar tidak bisa dipakai ulang
    await prisma.users.update({
      where: { id: user.id },
      data: {
        kode_verifikasi: null,
        verifikasi_exp: null,
      }
    });

    return res.status(200).json({
      status: true,
      data: updatedStan,
      message: "Stan berhasil diupdate.",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};

export const dropStan = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        /** make sure that data is exists in database */
        const findStan = await prisma.stan.findFirst({ where: { id: Number(id) } })
        if (!findStan) return response
            .status(200)
            .json({ status: false, message: `Stan is not found` })

        /** process to delete egg's data */
        const deletedStan = await prisma.stan.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedStan,
            message: `Stan has been deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}