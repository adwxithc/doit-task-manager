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
                .isLength({ min: 4, max: 20 })
                .withMessage(
                    "Password must be between 4 and 20 characters long"
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
        authController.resendOtp
    );

    router.post(
        "/signin",
        [
            body("email").isEmail().withMessage("Please provide a valid email"),
            body("password").notEmpty().withMessage("Password is required"),
        ],
        validateRequest,
        authController.signin
    );

    router.post("/signout", validateRequest, authController.signout);

    return router;
}
