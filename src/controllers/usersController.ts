import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "console";
import { nanoid } from "nanoid";
import { addDays } from "date-fns";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getUser = async (request: Request, response: Response) => {
  try {
    const { search } = request.query;
    const allUser = await prisma.users.findMany({
      where: { username: { contains: search?.toString() || "" } },
    });
    /** contains means search name of admin based on sent keyword */

    return response
      .json({
        status: true,
        data: allUser,
        message: `User has retrieved`,
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

export const Register = async (req: Request, res: Response) => {
  try {
    const { username, password, role, stanData, siswaData } = req.body;

    // Validasi input
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    if (!["admin_stan", "siswa"].includes(role)) {
      return res.status(400).json({ error: "Role tidak valid" });
    }

    // Cek apakah username sudah digunakan
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username sudah digunakan" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let filename = "";
    if (req.file) filename = req.file.filename;

    // Siapkan objek data
    const userData: any = {
      username,
      password: hashedPassword,
      role,
    };

    if (role === "admin_stan") {
      userData.stan = { create: stanData };
    } else if (role === "siswa") {
      userData.siswa = { create: siswaData };
    }

    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role,
        ...(role === "admin_stan" && { stan: { create: stanData } }),
        ...(role === "siswa" && {
          siswa: { create: { ...siswaData, foto: filename } },
        }),
        kode_verifikasi: nanoid(16),
      },
      include: {
        stan: true,
        siswa: true,
      },
    });

    return res.status(201).json({
      status: true,
      message: "User berhasil dibuat",
      data: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      status: false,
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};

export const Login = async (request: Request, response: Response) => {
  try {
    const { username, password } =
      request.body; /** get requested data (data has been sent from request) */

    /** find a valid admin based on username and password */
    const findUser = await prisma.users.findUnique({
      where: { username },
      include: {siswa: true, stan: true}
    });

    if (!username || !password) {
      return response
        .status(400)
        .json({ error: "Username and Password are required" });
    }

    if (!findUser) {
      return response.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      return response.status(400).json({ error: "Invalid Credentials" });
    }

    // Buat payload token berdasarkan role
    const payload: any = {
      userId: findUser.id,
      role: findUser.role,
      username: findUser.username,
    };

    if (findUser.role === "siswa") {
      payload.id_siswa = findUser.siswa?.id;
    } else if (findUser.role === "admin_stan") {
      payload.id_stan = findUser.stan?.id;
    }

    const token = jwt.sign(payload, process.env.JWT_TOKEN!, {
      expiresIn: "24h",
    });

    const kodeVerifikasiBaru = nanoid(16);
    const expired = addDays(new Date(), 1); // 1 hari dari sekarang

    await prisma.users.update({
      where: { id: findUser.id },
      data: {
        kode_verifikasi: kodeVerifikasiBaru,
        verifikasi_exp: expired,
      },
    });

    return response.status(200).json({
      status: true,
      logged: true,
      user: {
        id: findUser.id,
        username: findUser.username,
        role: findUser.role,
        kode_verifikasi: kodeVerifikasiBaru,
        verifikasi_exp: expired,
        id_siswa: findUser.siswa?.id,
        id_stan: findUser.stan?.id,
      },
      message: "Login Success",
      token,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

export const updateDataWithVerificationCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { kode } = req.params;
    const { username, password, siswaData, stanData } = req.body;

    const user = await prisma.users.findFirst({ where: { kode_verifikasi: kode } });

    if (!user) {
      return res.status(404).json({ status: false, message: "Kode verifikasi tidak ditemukan." });
    }

    const now = new Date();
    if (!user.verifikasi_exp || now > user.verifikasi_exp) {
      return res.status(403).json({ status: false, message: "Kode verifikasi sudah kedaluwarsa." });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    await prisma.users.update({
      where: { id: user.id },
      data: {
        username: username || user.username,
        password: hashedPassword || user.password,
        kode_verifikasi: null, // hapus kode agar tidak bisa dipakai ulang
        verifikasi_exp: null,
        ...(user.role === "siswa" &&
          siswaData && { siswa: { update: siswaData } }),
        ...(user.role === "admin_stan" &&
          stanData && { stan: { update: stanData } }),
      },
    });

    return res.json({
      status: true,
      message: "Data berhasil diperbarui",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Terjadi kesalahan: ${err}`,
    });
  }
};

export const updateUser = async (request: Request, response: Response) => {
  try {
    const { id } =
      request.params; /** get id of egg's id that sent in parameter of URL */
    const { username, password, role } =
      request.body; /** get requested data (data has been sent from request) */

    /** make sure that data is exists in database */
    const findUser = await prisma.users.findFirst({
      where: { id: Number(id) },
    });
    if (!findUser)
      return response
        .status(200)
        .json({ status: false, message: `User is not found` });

    /** process to update admin's data */
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        username: username || findUser.username,
        password: password ? md5(password) : findUser.password,
        role: role || findUser.role,
      },
    });

    return response
      .json({
        status: true,
        data: updatedUser,
        message: `User has updated`,
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

export const dropUser = async (request: Request, response: Response) => {
  try {
    const { id } =
      request.params; /** get id of egg's id that sent in parameter of URL */

    /** make sure that data is exists in database */
    const findUser = await prisma.users.findFirst({
      where: { id: Number(id) },
    });
    if (!findUser)
      return response
        .status(200)
        .json({ status: false, message: `User is not found` });

    /** process to delete admin's data */
    const deletedUser = await prisma.users.delete({
      where: { id: Number(id) },
    });
    return response
      .json({
        status: true,
        data: deletedUser,
        message: `User has deleted`,
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
