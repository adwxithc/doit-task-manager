import axios from "axios";

import { BadRequestError } from "../errors/bad-request-error";
import { unverifiedUserRepository } from "../repository/unverifiedUserRepository";
import { generateOTP } from "../services/generateOtp";
import { hash } from "../services/Hash";
import { sendMail } from "../services/sendMail";
import { IUnverifiedUser, IUser } from "../types/data";
import { Req, Res } from "../types/expressTypes";
import userRepository from "../repository/userRepository";
import { jWTToken } from "../services/jwt";
import { tokenOptions } from "../utils/tockenOptions";

class AuthController {
    async signup(req: Req, res: Res) {
        const { name, email, password } = req.body as IUser;

        const exist = await userRepository.findByEmail(email);

        if (exist) {
            throw new BadRequestError(
                "user already exist with the same mail id please login"
            );
        }

        const otp = generateOTP();

        // send mail
        await sendMail.sendEmailVerification(name, email, otp);

        const hashPassword = await hash.createHash(password as string);
        const user = {
            name,
            email,
            password: hashPassword,
            otp,
        } as IUnverifiedUser;

        await unverifiedUserRepository.storeUser(email, user);

        res.json({
            data: { otpSentAt: Date.now() },
            success: true,
            message: "verification otp has been send to the mail",
        });
    }

    async verifyOtp(req: Req, res: Res) {
        const { email, otp } = req.body as { email: string; otp: string };
        const checkUser = await unverifiedUserRepository.getUser(email);
        if (!checkUser) {
            throw new BadRequestError("session expired please signup");
        }

        if (otp !== checkUser.otp) {
            throw new BadRequestError("invalid otp ");
        }
        const { name, password } = checkUser;
        const newUser = {
            name,
            email,
            password,
        };

        const unverifiedUserDeletePromise =
            unverifiedUserRepository.deleteUser(email);
        const userPromise = userRepository.createUser(newUser);

        await Promise.all([userPromise, unverifiedUserDeletePromise]);
        res.json({
            success: true,
            data: {
                name,
                email,
            },
            message:
                "Account created, please login with your email and password",
        });
    }

    async signin(req: Req, res: Res) {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError("invalid email or password");
        }

        const passwordMatch = await hash.comparePassword(
            password,
            user.password
        );

        if (!passwordMatch) {
            throw new BadRequestError("invalid email or password");
        }

        const token = jWTToken.createJWT(
            { email },
            process.env.JWT_KEY as string
        );

        res.cookie("jwt", token, tokenOptions);

        res.json({
            success: true,
            data: { name: user.name, email },
        });
    }

    async googleSignin(req: Req, res: Res) {
        const { token } = req.body as { token: string };

        const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
        // Verify the token with Google
        const googleResponse = await axios.get(`${GOOGLE_OAUTH_URL}?id_token=${token}`);

        const { email } = googleResponse.data;

        // Check if user  exists
        const user = await userRepository.findByEmail(email);
        if (!user) {
            res.json({
                success:false,
                message:"Please create an account to login"
            });
            return;
        }

        // Create JWT
        const jwtToken = jWTToken.createJWT(
            { email },
            process.env.JWT_KEY as string
        );

        res.cookie("jwt", jwtToken, tokenOptions);

        res.json({
            success: true,
            data: { name: user.name, email }
        });
    
    }

    async signout(req: Req, res: Res) {
        res.clearCookie("jwt");
        res.json({
            success: true,
            message: "successfully logout",
        });
    }

    async resendOtp(req: Req, res: Res) {
        const { email } = req.body;

        const checkUser = await unverifiedUserRepository.getUser(email);
        if (!checkUser) {
            throw new BadRequestError("session expired please signup");
        }

        const otp = generateOTP();

        // send mail
        const sendMailPromise = sendMail.sendEmailVerification(
            checkUser.name,
            email,
            otp
        );

        const storeUserPromiser = unverifiedUserRepository.storeUser(email, {
            ...checkUser,
            otp,
        });

        await Promise.all([sendMailPromise, storeUserPromiser]);

        res.json({
            success: true,
            message: "verification otp has been resend to the mail",
            data: { otpSentAt: Date.now() },
        });
    }
}

export const authController = new AuthController();
