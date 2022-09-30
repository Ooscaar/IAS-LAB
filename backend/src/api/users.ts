import { randomBytes } from "crypto";
import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { compare, hash } from "bcrypt";

export const users = express.Router();

/**
 * POST /users/register
 */
users.post("/register", async (req, res) => {
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).json({ message: "Missing username or password" });
    }

    // Create new user
    try {
        const hashedPassword = await hash(password, 10);
        await prisma.user.create({
            data: {
                userName: username,
                password: hashedPassword,
                roles: "USER"
            }
        })

        res.status(201).send()

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // User already exists error
            if (error.code === 'P2002') {
                console.log("User already exists");
                res.status(409).json({ status: "error", message: "Username already taken" });
            }
        }
        console.log(`Error: ${error}`)
        throw error;
    }
})


/**
 * POST /users/login
 */
users.post("/login", async (req, res) => {
    console.log(JSON.stringify(req.body))
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).json({ message: "Missing username or password" });
    }

    // Find user with username  
    const user = await prisma.user.findUnique({
        where: { userName: username }
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
    res.status(200).send()

})


/**
 * POST /users/logout
 */
users.post("/logout", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    // Remove all sessions from user
    await prisma.session.deleteMany({
        where: {
            userId: userId
        }
    })

    res.cookie("sessionId", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "strict",
        secure: true
    })
    res.status(200).send()

})

/**
 * POST /users/me
 */
users.get("/me", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    res.json({
        user: {
            userName: user!.userName,
            isAdmin: user!.roles.includes("ADMIN")
        }
    })
})