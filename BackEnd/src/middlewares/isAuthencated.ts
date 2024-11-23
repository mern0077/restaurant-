// import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const isAuthencated = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token as string;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        // verify the toekn
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
        // check is decoding was successfull
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        req.id = decode.userId;
        next();
    } catch (error: any) {
        console.log("isAuthencated", error.message);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}































// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// // this is optional for req.id
// declare global {
//     namespace Express {
//         interface Request {
//             id: string;
//         }
//     }
// }

// export const isAuthencated = (req: any, res: any, next: NextFunction) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User not authencated...",
//             })
//         }

//         // jwt verify the token

//         const decode = jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
//         if (!decode) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token",
//             })
//         }
//         req.id = decode.userId;
//         next();

//     } catch (error: any) {
//         console.log(`error from isAuthencated : ${error.message}`);
//         return res.status(500).json({ message: "Internal server error" })
//     }
// }