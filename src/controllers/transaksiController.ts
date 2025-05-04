import { request, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllTransaksi = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 10;
    const keyword = request.query.keyword?.toString() || "";
    const transactions = await prisma.transaksi.findMany({
      include: {
        DetailTransaksi: {
          include: {
            menu_detail: {
              include: {
                MenuDiskon: { include: { diskon_detail: true } },
              },
            },
          },
        },
      },
    });

    const transaksiWithTotal = transactions.map((transactions) => {
      let totalHarga = 0;

      transactions.DetailTransaksi.forEach((detail) => {
        let harga_beli = detail.menu_detail.harga;

        detail.menu_detail.MenuDiskon.forEach(({ diskon_detail }) => {
          const now = new Date();
          if (
            now >= diskon_detail.tanggal_awal &&
            now <= diskon_detail.tanggal_akhir
          ) {
            harga_beli -= harga_beli * (diskon_detail.persentase_diskon / 100);
          }
        });

        totalHarga += harga_beli * detail.qty;
      });

      return {
        ...transactions,
        totalHarga,
      };
    });

    return response.status(201).json(transaksiWithTotal);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const getPesananAktifSiswa = async (req: Request, res: Response) => {
  try {
    const siswaId = (req as any).user.id_siswa; // didapat dari token auth

    if (!siswaId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const pesananAktif = await prisma.transaksi.findMany({
      where: {
        id_siswa: siswaId,
        status: { not: "sampai" }, // status selain selesai dianggap aktif
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    console.log("Pesanan ditemukan:", pesananAktif.length);


    return res.status(200).json({
      status: true,
      data: pesananAktif,
      message: "Pesanan aktif berhasil diambil",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `Terjadi kesalahan: ${error}` });
  }
};

export const getHistoriTransaksiByMonth = async (
  req: Request,
  res: Response
) => {
  try {
    const siswaId = (req as any).user?.id_siswa;
    const { bulan, tahun } = req.query;

    if (!siswaId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    if (!bulan || !tahun) {
      return res
        .status(400)
        .json({ status: false, message: "Bulan dan tahun wajib diisi" });
    }

    const bulanInt = parseInt(bulan.toString());
    const tahunInt = parseInt(tahun.toString());

    const awalBulan = new Date(tahunInt, bulanInt - 1, 1);
    const akhirBulan = new Date(tahunInt, bulanInt, 1); // otomatis hari pertama bulan berikutnya

    const histori = await prisma.transaksi.findMany({
      where: {
        id_siswa: siswaId,
        tanggal: {
          gte: awalBulan,
          lt: akhirBulan,
        },
      },
      include: {
        DetailTransaksi: {
          include: {
            menu_detail: {
              include: {
                MenuDiskon: {
                  include: { diskon_detail: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    const transaksiWithTotal = histori.map((transactions) => {
      let totalHarga = 0;

      transactions.DetailTransaksi.forEach((detail) => {
        let harga_beli = detail.menu_detail.harga;

        detail.menu_detail.MenuDiskon.forEach(({ diskon_detail }) => {
          const now = new Date();
          if (
            now >= diskon_detail.tanggal_awal &&
            now <= diskon_detail.tanggal_akhir
          ) {
            harga_beli -= harga_beli * (diskon_detail.persentase_diskon / 100);
          }
        });

        totalHarga += harga_beli * detail.qty;
      });

      return {
        ...transactions,
        totalHarga,
      };
    });

    return res.status(200).json({
      status: true,
      data: histori, 
      message: `Histori transaksi bulan ${bulan}/${tahun} dengan total harga ${transaksiWithTotal}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `Terjadi kesalahan: ${error}` });
  }
};

export const createTransaksi = async (request: Request, response: Response) => {
  try {
    const { tanggal, id_stan, id_siswa, items } =
      request.body; /** get requested data (data has been sent from request) */

    /** process to save new egg */
    const newTransaksi = await prisma.transaksi.create({
      data: {
        tanggal: new Date(tanggal).toISOString(),
        id_stan: Number(id_stan),
        id_siswa: Number(id_siswa),
        status: "belum_dikonfirmasi",
      },
      include: { DetailTransaksi: true },
    });

    let totalHarga = 0;

    const detailTransaksi = await Promise.all(
      items.map(async (items: { id_menu: number; qty: number }) => {
        const menu = await prisma.menu.findUnique({
          where: { id: items.id_menu },
          include: { MenuDiskon: { include: { diskon_detail: true } } },
        });
        if (!menu) {
          throw new Error(`Menu dengan ID ${items.id_menu} tidak ditemukan`);
        }

        let harga_beli = menu.harga;
        menu.MenuDiskon.forEach(({ diskon_detail }) => {
          const now = new Date();
          if (
            now >= diskon_detail.tanggal_awal &&
            now <= diskon_detail.tanggal_akhir
          ) {
            harga_beli -= harga_beli * (diskon_detail.persentase_diskon / 100);
          }
        });

        totalHarga += harga_beli * items.qty;

        return prisma.detailTransaksi.create({
          data: {
            id_transaksi: newTransaksi.id,
            id_menu: items.id_menu,
            qty: items.qty,
            harga_beli,
          },
        });
      })
    );

    return response.status(201).json({
      message: "Transaksi successfully created",
      newTransaksi: newTransaksi.id,
      totalHarga,
      detailTransaksi: detailTransaksi,
    });
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const updateTransaksi = async (request: Request, response: Response) => {
  try {
    const { id } =
      request.params; /** get id of egg's id that sent in parameter of URL */
    const { tanggal, id_stan, id_siswa, status, details } =
      request.body; /** get requested data (data has been sent from request) */

    /** make sure that data is exists in database */
    const findTransaksi = await prisma.transaksi.findFirst({
      where: { id: Number(id) },
    });
    if (!findTransaksi)
      return response
        .status(200)
        .json({ status: false, message: `Transaksi is not found` });

    /** process to update egg's data */
    const updatedTransaksi = await prisma.transaksi.update({
      data: {
        tanggal: tanggal || findTransaksi.tanggal,
        id_stan: id_stan || findTransaksi.id_stan,
        id_siswa: id_siswa || findTransaksi.id_siswa,
        status: status || findTransaksi.status,
      },
      where: { id: parseInt(id) },
    });

    return response
      .json({
        status: true,
        data: updatedTransaksi,
        message: `Transaksi has been updated`,
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

// PUT /transaksi/:id/update-status
export const updateStatusPesananByStan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = (req as any).user; // ambil data dari token auth
    if (!user || user.role !== "admin_stan") {
      return res.status(403).json({ status: false, message: "Access denied" });
    }

    const transaksi = await prisma.transaksi.findFirst({
      where: { id: Number(id) },
      include: {
        DetailTransaksi: {
          include: {
            menu_detail: true
          }
        }
      },
    });
    
    
    
    if (!transaksi) {
      return res.status(404).json({ status: false, message: "Pesanan tidak ditemukan" });
    }
    
    console.log("User Stan ID:", user.id_stan);
console.log("DetailTransaksi:");
transaksi.DetailTransaksi.forEach((detail) => {
  console.log({
    menuId: detail.menu_detail.id,
    menuStanId: detail.menu_detail.id_stan,
  });
});
    // pastikan transaksi ini berasal dari stan milik admin tersebut
    const isFromOwnStan = transaksi.DetailTransaksi.every(
      (detail) => detail.menu_detail.id_stan === user.id_stan
    );

    if (!isFromOwnStan) {
      return res.status(403).json({ status: false, message: "Tidak bisa ubah pesanan dari stan lain" });
    }

    const updated = await prisma.transaksi.update({
      where: { id: Number(id) },
      data: {
        status,
      },
    });



    return res.status(200).json({
      status: true,
      data: updated,
      message: `Status pesanan berhasil diubah menjadi '${status}'`,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};


export const dropTransaksi = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    /** make sure that data is exists in database */
    const findTransaksi = await prisma.transaksi.findFirst({
      where: { id: Number(id) },
    });
    if (!findTransaksi)
      return response
        .status(200)
        .json({ status: false, message: `Transaksi is not found` });

    /** process to delete egg's data */
    const deletedTransaksi = await prisma.transaksi.delete({
      where: { id: Number(id) },
    });
    return response
      .json({
        status: true,
        data: deletedTransaksi,
        message: `Transaksi has been deleted`,
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

export const Receipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validasi ID transaksi
    const transaksiId = Number(id);
    if (!id || isNaN(transaksiId)) {
      return res.status(400).json({ status: false, message: "ID transaksi tidak valid" });
    }

    // Ambil detail transaksi
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId },
      include: {
        DetailTransaksi: {
          include: {
            menu_detail: true,
          },
        },
        siswa_detail: true,
        stan_detail: true,
      },
    });

    if (!transaksi) {
      return res.status(404).json({ status: false, message: "Transaksi tidak ditemukan" });
    }

    // Hitung total dan buat list item
    let totalHarga = 0;
    const items = transaksi.DetailTransaksi.map((detail) => {
      const subtotal = detail.qty * detail.harga_beli;
      totalHarga += subtotal;
      return {
        nama_menu: detail.menu_detail.nama_makanan,
        qty: detail.qty,
        harga_satuan: detail.harga_beli,
        subtotal,
      };
    });

    const nota = {
      transaksi_id: transaksi.id,
      tanggal: transaksi.tanggal,
      nama_siswa: transaksi.siswa_detail.nama_siswa,
      nama_stan: transaksi.stan_detail.nama_stan,
      nama_pemilik: transaksi.stan_detail.nama_pemilik,
      items,
      total: totalHarga,
      status: transaksi.status,
    };

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil data nota",
      data: nota,
    });

  } catch (error) {
    console.error("Gagal mengambil nota transaksi:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengambil nota transaksi",
    });
  }
};


export const rekapPemasukan = async (request: Request, response: Response) => {
  try {
    const { id, bulan, tahun } = request.query;

    const pemasukan = await prisma.transaksi.findMany({
      where: {
        id_stan: Number(id as string),
        tanggal: {
          gte: new Date(`${tahun}-${bulan}-01`),
          lt: new Date(`  ${tahun}-${parseInt(bulan as string) + 1}-01`),
        },
      },
      include: {
        DetailTransaksi: true,
      },
    });

    let totalPemasukan = 0;
    const transaksiRekap = pemasukan.map((trx) => {
      let totalHarga = 0;
      trx.DetailTransaksi.forEach((detail) => {
        totalHarga += detail.harga_beli * detail.qty;
      });
      totalPemasukan += totalHarga;
      return {
        id: trx.id,
        tanggal: trx.tanggal,
        totalHarga,
      };
    });

    return response.status(200).json({ totalPemasukan, transaksiRekap });
  } catch (error) {
    console.error("Error saat mengambil rekap pemasukan:", error);
    return response
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil rekap pemasukan" });
  }
};
