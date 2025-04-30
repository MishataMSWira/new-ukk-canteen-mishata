"use strict";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient({ errorFormat: "pretty" })
// export const getAllDetailTransaksi = async (request: Request, response: Response) => {
//     try {
//         const page = Number(request.query.page) || 1;
//       const qty = Number(request.query.qty) || 10;
//       const keyword = request.query.keyword?.toString() || "";
//       const dataDetailTransaksi = await prisma.detailTransaksi.findMany({
//         take: qty, // mendefinisikan jml data yg diambil
//         skip: (page -1) * qty,
//         orderBy: {id: "asc"},
//         include : {transaksi_detail : true, menu_detail : true}
//       });
//         return response.json({
//             status: true,
//             data: dataDetailTransaksi,
//             message: `Transaksi Detail has retrieved`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }
// export const createDetailTransaksi = async (request: Request, response: Response) => {
//     try {
//         const { id_transaksi, id_menu, qty, } = request.body /** get requested data (data has been sent from request) */
//         const transaksi = await prisma.transaksi.findUnique({
//             where : {
//                 id : id_transaksi
//             }
//         })
//         if (!transaksi) {
//             return response.status(401).json({
//                 status : true,
//                 message: "Transaksi not found"
//             })
//         }
//         const menu = await prisma.menu.findUnique({
//             where : {
//                 id : id_menu
//             }
//         })
//         if (!menu) {
//             return response.status(401).json({
//                 status : true,
//                 message : "Menu not found" 
//             })
//         }
//         const harga_beli = Number(menu.harga) * qty
//         /** process to save new egg */
//         const newDetailTransaksi = await prisma.detailTransaksi.create({
//             data: { 
//                 id_transaksi : Number(id_transaksi),
//                 id_menu : Number(id_menu),
//                 qty : Number(qty),
//                 harga_beli : Number(harga_beli)
//              },
//              include : {
//                 transaksi_detail : true,
//                 menu_detail : true
//              }
//         })
//         /** price and stock have to convert in number type */
//         return response.json({
//             status: true,
//             data: newDetailTransaksi,
//             message: `New Transaksi Detail has created`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }
// export const updateDetailTransaksi = async (request: Request, response: Response) => {
//     try {
//         const { id } = request.params /** get id of egg's id that sent in parameter of URL */
//         const { id_transaksi, id_menu, qty } = request.body /** get requested data (data has been sent from request) */
//         /** make sure that data is exists in database */
//         const findDetailTransaksi = await prisma.detailTransaksi.findFirst({ where: { id: Number(id) } })
//         if (!findDetailTransaksi) return response
//             .status(200)
//             .json({ status: false, message: `Transaksi Detail is not found` })
//             const transaksi = await prisma.transaksi.findUnique({
//                 where : {
//                     id : id_transaksi
//                 }
//             })
//             if (!transaksi) {
//                 return response.status(401).json({
//                     status : true,
//                     message: "Transaksi not found"
//                 })
//             }
//             const menu = await prisma.menu.findUnique({
//                 where : {
//                     id : id_menu
//                 }
//             })
//             if (!menu) {
//                 return response.status(401).json({
//                     status : true,
//                     message : "Menu not found" 
//                 })
//             }
//             const harga_beli = Number(menu.harga) * qty
//         /** process to update egg's data */
//         const updatedDetailTransaksi = await prisma.detailTransaksi.update({
//             data: {
//                 id_transaksi: id_transaksi || findDetailTransaksi.id_transaksi,
//                 id_menu : id_menu || findDetailTransaksi.id_menu,
//                 qty : qty || findDetailTransaksi.qty,
//                 harga_beli : harga_beli || findDetailTransaksi.harga_beli
//             },
//             where: { id: Number(id) },
//             include : {
//                 transaksi_detail : true,
//                 menu_detail : true
//             }
//         })
//         return response.json({
//             status: true,
//             data: updatedDetailTransaksi,
//             message: `Transaksi Detail has been updated`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }
// export const dropDetailTransaksi = async (request: Request, response: Response) => {
//     try {
//         const { id } = request.params
//         /** make sure that data is exists in database */
//         const findDetailTransaksi = await prisma.detailTransaksi.findFirst({ where: { id: Number(id) } })
//         if (!findDetailTransaksi) return response
//             .status(200)
//             .json({ status: false, message: `Transaksi Detail is not found` })
//         /** process to delete egg's data */
//         const deletedDetailTransaksi = await prisma.detailTransaksi.delete({
//             where: { id: Number(id) }
//         })
//         return response.json({
//             status: true,
//             data: deletedDetailTransaksi,
//             message: `Transaksi Detail has been deleted`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }
