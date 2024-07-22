import { Router } from "express";
import { body } from "express-validator";

import { authController } from "../controller/authController";
import { validateRequest } from "../middlewares/validateRequest";
export function authRouter(router: Router) {
    router.post(
        "/signup",
        [
            body("name").notEmpty().withMessage("name is required"),
            body("email").isEmail().withMessage("Please provide a valid email"),
            body("password")
                .isLength({ min: 6, max: 20 })
                .withMessage(
                    "Password must be between 6 and 20 characters long"
                )
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/
                )
                .withMessage(
                    "Password must contain at least one letter, one number, and one special character"
                ),
        ],
        validateRequest,
        authController.signup
    );

    router.post(
        "/verify-otp",
        [
            body("email").isEmail().withMessage("Please provide a valid email"),
            body("otp").notEmpty().withMessage("OTP is required"),
        ],
        validateRequest,
        authController.verifyOtp
    );
    router.post(
        "/resend-otp",
        [
            body("email").isEmail().withMessage("Please provide a valid email"),
        ],
        validateRequest,  
        authController.resendOtp
    );

    router.post(
        "/signin",
        [
            body("email").isEmail().withMessage("Please provide a valid email"),
            body("password")
                .isLength({ min: 6, max: 20 })
                .withMessage(
                    "Password must be between 6 and 20 characters long"
                )
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/
                )
                .withMessage(
                    "Password must contain at least one letter, one number, and one special character"
                ),
        ],
        validateRequest,
        authController.signin
    );

    router.post(
        "/google-auth",
        [
            body("token").notEmpty().withMessage("token can't be empty"),
        ],
        validateRequest,  
        authController.googleSignin
    );

    router.post("/signout", validateRequest, authController.signout);

    return router;
}
