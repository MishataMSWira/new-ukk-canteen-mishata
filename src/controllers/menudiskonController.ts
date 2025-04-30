// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({ errorFormat: "pretty" })

// export const getAllMenuDiskon = async (request: Request, response: Response) => {
//     try {
//         const page = Number(request.query.page) || 1;
//       const qty = Number(request.query.qty) || 10;
//       const keyword = request.query.keyword?.toString() || "";
//       const dataMenuDiskon = await prisma.menuDiskon.findMany({
//         take: qty, // mendefinisikan jml data yg diambil
//         skip: (page -1) * qty,
//         orderBy: {id: "asc"}
//       });
//         return response.json({
//             status: true,
//             data: dataMenuDiskon,
//             message: `Menu Diskon has retrieved`
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

// export const createMenuDiskon = async (request: Request, response: Response) => {
//     try {
//         const { id_menu, id_diskon } = request.body /** get requested data (data has been sent from request) */

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

//         const diskon = await prisma.diskon.findUnique({
//             where : {
//                 id: id_diskon
//             }
//         })

//         if (!diskon) {
//             return response.status(401).json({
//                 status : true,
//                 message : "Diskon not found"
//             })
//         }

//         const price_discount = Number(menu.harga) * diskon.persentase_diskon

//         /** process to save new egg */
//         const newMenuDiskon = await prisma.menuDiskon.create({
//             data: { id_menu : Number(id_menu),id_diskon : Number(id_diskon) }, include : {menu_detail :true, diskon_detail :true}
//         })
//         /** price and stock have to convert in number type */

//         return response.json({
//             status: true,
//             data: newMenuDiskon,
//             message: `New Menu Diskon has created`
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

// export const updateMenuDiskon = async (request: Request, response: Response) => {
//     try {
//         const { id } = request.params /** get id of egg's id that sent in parameter of URL */
//         const { id_menu, id_diskon } = request.body /** get requested data (data has been sent from request) */

//         /** make sure that data is exists in database */
//         const findMenuDiskon = await prisma.menuDiskon.findFirst({ where: { id: Number(id) } })
//         if (!findMenuDiskon) return response
//             .status(200)
//             .json({ status: false, message: `Menu is not found` })

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
    
//             const diskon = await prisma.diskon.findUnique({
//                 where : {
//                     id: id_diskon
//                 }
//             })
    
//             if (!diskon) {
//                 return response.status(401).json({
//                     status : true,
//                     message : "Diskon not found"
//                 })
//             }



//         /** process to update egg's data */
//         const updatedMenuDiskon = await prisma.menuDiskon.update({
//             data: {
//                 id_menu: id_menu ? Number(id_menu) : findMenuDiskon.id_menu,
//                 id_diskon: id_diskon ? Number(id_diskon) : findMenuDiskon.id_diskon
                
//             },
//             where: { id: Number(id) }
//         })

//         return response.json({
//             status: true,
//             data: updatedMenuDiskon,
//             message: `Menu Diskon has been updated`
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

// export const dropMenuDiskon = async (request: Request, response: Response) => {
//     try {
//         const { id } = request.params
//         /** make sure that data is exists in database */
//         const findMenuDiskon = await prisma.menuDiskon.findFirst({ where: { id: Number(id) } })
//         if (!findMenuDiskon) return response
//             .status(200)
//             .json({ status: false, message: `Menu Diskon is not found` })

//         /** process to delete egg's data */
//         const deletedMenuDiskon = await prisma.menuDiskon.delete({
//             where: { id: Number(id) }
//         })
//         return response.json({
//             status: true,
//             data: deletedMenuDiskon,
//             message: `Menu Diskon has been deleted`
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