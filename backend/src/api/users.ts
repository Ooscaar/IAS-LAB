import { Prisma } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import express from "express";
import { prisma } from "../client";
import { SALT_ROUNDS } from "../const";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const users = express.Router();

/**
 * POST /users/register
 */
users.post("/register", async (req, res, next) => {
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        return res.status(422).json({ message: "Missing username or password" });
    }

    // Create new user
    try {
        const hashedPassword = await hash(password, SALT_ROUNDS);
        await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                roles: "USER"
            }
        })

        return res.status(201).send()

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // User already exists error
            if (error.code === 'P2002') {
                console.log("User already exists");
                return res.status(409).json({ message: "Username already taken" });
            }
        }
        next(error);
    }
})


/**
 * POST /users/login
 */
users.post("/login", async (req, res, next) => {
    console.log(JSON.stringify(req.body))
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        return res.status(422).json({ message: "Missing username or password" });
    }

    try {
        // Find user with username  
        const user = await prisma.user.findUnique({
            where: { username: username }
        })

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // Create sessionId with randombytes
        const sessionId = randomBytes(16).toString("hex");
        const EXPIRATION_DAYS = 1000 * 60 * 60 * 24 * 7; // 7 days

        await prisma.session.create({
            data: {
                id: sessionId,
                expires: new Date(Date.now() + EXPIRATION_DAYS),
                userId: user.id
            }
        })

        // Set cookie
        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            maxAge: EXPIRATION_DAYS,
            sameSite: "strict",
            secure: true
        })
        return res.status(200).send()
    } catch (error) {
        next(error)
    }

})


/**
 * POST /users/logout
 */
users.post("/logout", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    try {
        // Remove all sessions from user
        await prisma.session.deleteMany({
            where: {
                userId: userId
            }
        })

        res.clearCookie("sessionId")

        return res.status(200).send()

    } catch (error) {
        next(error)
    }
})

/**
 * POST /users/me
 */
users.get("/me", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        return res.status(200).json({
            user: {
                username: user!.username,
                isAdmin: user!.roles.includes("ADMIN")
            }
        })
    } catch (error) {
        next(error)
    }
})