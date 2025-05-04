import PDFDocument from "pdfkit";
import { Response, Request } from "express";
import { PassThrough } from "stream";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const generateReceiptPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaksiId = Number(id);

    if (isNaN(transaksiId)) {
      return res.status(400).json({ error: "ID transaksi tidak valid" });
    }

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId },
      include: {
        DetailTransaksi: {
          include: { menu_detail: true },
        },
        siswa_detail: true,
        stan_detail: true,
      },
    });

    if (!transaksi) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const doc = new PDFDocument({
      size: [450.77, 600], // Ukuran kira-kira kertas 80mm (lebar struk kasir)
      margins: { top: 10, bottom: 10, left: 10, right: 10 },
    });
    const stream = new PassThrough();

    res.setHeader("Content-disposition", `inline; filename=nota-${id}.pdf`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(stream);

    // Font monospaced untuk tata letak rapi
    doc.font("Courier");

    // Header
    doc.fontSize(20).text("STAN KANTIN SMK", { align: "center" });
    doc.fontSize(16).text(`${transaksi.stan_detail.nama_stan}`, { align: "center" });
    doc.text(`--------------------------------------------`);

    doc.fontSize(14);
    doc.text(`No      : ${transaksi.id}`);
    doc.text(`Tanggal : ${transaksi.tanggal.toLocaleString("id-ID")}`);
    doc.text(`Siswa   : ${transaksi.siswa_detail.nama_siswa}`);
    doc.text(`Status  : ${transaksi.status}`);
    doc.text(`--------------------------------------------------`);

    // Tabel Pesanan
    let totalHarga = 0;
    transaksi.DetailTransaksi.forEach((item) => {
      const nama = item.menu_detail.nama_makanan;
      const qty = item.qty;
      const harga = item.harga_beli;
      const subtotal = qty * harga;
      totalHarga += subtotal;

      doc.text(`${nama}`);
      doc.text(`${qty} x ${harga.toLocaleString("id-ID")} = ${subtotal.toLocaleString("id-ID")}`, {
        align: "right",
      });
    });

    doc.text(`---------------------------------------------------`);
    doc.fontSize(12).text(`TOTAL: Rp ${totalHarga.toLocaleString("id-ID")}`, {
      align: "right",
    });

    doc.moveDown();
    doc.fontSize(12).text("Terima kasih telah membeli!", { align: "center" });

    doc.end();
    stream.pipe(res);
  } catch (err) {
    console.error("Gagal generate nota PDF:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat nota PDF" });
  }
};
