// import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail } from "../mailtrap/email";


export const signUp = async (req: any, res: any) => {
    try {
        const { fullname, email, password, contact } = req.body;
        console.log(req.body);


        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })
        generateToken(res, user);

        await sendVerificationEmail(email, verificationToken);

        const userWithoutPassword = await User.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }+
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        // send user without passowrd
        const userWithoutPassword = await User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

// export const login = async (req: any, res: any) => {
//     try {
//         const { email, password } = req.body;
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "email or password is incorrect" })
//         }

//         const isPasswordMatched = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatched) {
//             return res.status(400).json({ success: false, message: "email or password is incorrect" })
//         }

//         generateToken(res, user);
//         user.lastLogin = new Date();
//         await user.save();

//         const userWithoutPassword = User.findOne({ email }).select("-password")

//         return res.status(200).json({
//             success: true,
//             message: `welcome back ${user.fullname}`,
//             user: userWithoutPassword,
//         })

//     } catch (error: any) {
//         console.log("error from login : ", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

export const verifyEmail = async (req: any, res: any) => {
    try {
        const { verificationCode } = req.body;
        console.log(verificationCode);
        
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token",
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully...",
            user,
        })


    } catch (error: any) {
        console.log("error from verifyEmail : ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logOut = async (_: any, res: any) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully..."
        })
    } catch (error: any) {
        console.log("error from logOut : ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const forgotPassword = async (req: any, res: any) => {
    try {

        const { email } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist",
            })
        }

        const resetToken = crypto.randomBytes(40).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email

        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        return res.status(201).json({
            success: true,
            message: "password reset link sent to your email",
        })

    } catch (error: any) {
        console.log("error from forgotPassword : ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const resetpassword = async (req: any, res: any) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" })
        }
        //update password

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email 
        await sendResetSuccessEmail(user.email);

        return res.status(201).json({
            success: true,
            message: "Password reset successfully...",
        })

    } catch (error: any) {
        console.log(`error from resetpassword : ${error.message}`);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const checkAuth = async (req: any, res: any) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: true,
                message: "user not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error: any) {
        console.log(`error from checkAuth : ${error.message}`);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req: any, res: any) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;
        // upload image on cloudinary
        let cloudResponse: any;
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData = {fullname, email, address, city, country, profilePicture};

        const user = await User.findByIdAndUpdate(userId, updatedData,{new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user,
            message:"Profile updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



// export const updateProfile = async (req: any, res: any) => {
//     try {
//         const userId = req.id;
//         const { fullname, email, address, city, country, profilePicture } = req.body;
//         console.log(fullname, email, address, city, country, profilePicture);
        
//         // upload image on cloudinary
//         let cloudResponse: any;

//         cloudResponse = await cloudinary.uploader.upload(profilePicture);
//         console.log("cloudresponse",cloudResponse);
        
//         const updatedData = { fullname, email, address, city, country, profilePicture };
//         console.log("2",updatedData);
        
//         const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
//         console.log("3",user);
        
//         return res.status(201).json({
//             success: true,
//             user,
//             message: "profile updated successfully...",
//         })

//     } catch (error: any) {
//         console.log(error);
//         // console.log(`error from updateProfile : ${error}`);
//         return res.status(500).json({ message: "Internal server error" })
//     }
// }