import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
    "/register", 
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
        check("firstName", "First name is required").not().isEmpty(),
        check("lastName", "Last name is required").not().isEmpty(),
    ], 
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ 
                email: req.body.email 
            });

            if (user) {
                return res.status(400).json({ error: "User already exists" });
            }

            user = new User(req.body);
            await user.save();

            const token = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn: "1d"
                }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(200).send({ message: "User registered OK" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Something went wrong" });
        }
    }
);

export default router;