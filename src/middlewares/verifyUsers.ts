import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const allowedRoles = ["admin_stan", "siswa"];

// Skema validasi umum
const commonSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...allowedRoles).required(),
});

// Skema validasi admin_stan
const adminStanSchema = commonSchema.keys({
  stanData: Joi.object({
    nama_stan: Joi.string().required(),
    nama_pemilik: Joi.string().required(),
    telp: Joi.string().pattern(/^\d{10,15}$/).required(),
  }).required(),
});

// Skema validasi siswa
const siswaSchema = commonSchema.keys({
  siswaData: Joi.object({
    nama_siswa: Joi.string().required(),
    alamat: Joi.string().required(),
    telp: Joi.string().required(),
  }).required(),
  foto: Joi.any().optional(),
});

  
  // Login Schema
  const loginSchema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Invalid Username",
      "any.required": "Username is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  });
  
  // Update User Schema
  const updateUserSchema = Joi.object({
    username: Joi.string().min(1).messages({
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 1 character long",
    }),
    password: Joi.string().min(6).messages({
      "string.min": "Password must be at least 6 characters long",
    }),
    role: Joi.string()
      .valid(...allowedRoles)
      .messages({
        "any.only": `Role must be one of: ${allowedRoles.join(", ")}`,
      }),
  });

// Middleware validasi berdasarkan role
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  console.log("Body: ", req.body);
  console.log("File: ", req.file);
  
  const { role } = req.body;

  let schema;
  if (role === "admin_stan") {
    schema = adminStanSchema;
  } else if (role === "siswa") {
    schema = siswaSchema;
  } else {
    return res.status(400).json({
      status: false,
      message: `Role tidak valid. Pilihan: ${allowedRoles.join(", ")}.`,
    });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((err) => err.message),
    });
  }

  next();
};

export const verifyEditUser = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateUserSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyLoginUser = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = loginSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
