import { randomBytes } from "crypto";
import express from "express";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const users = express.Router();

users.post("/register", async (req, res) => {
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).json({ status: "error", message: "Missing username or password" });
    }

    // Create new user
    try {
        const user = await prisma.user.create({
            data: {
                userName: username,
                password: password
            }
        })

        // Send 201 status code
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    userName: user.userName,
                    roles: user.roles
                }
            }
        })
    } catch (error) {
        // General for now
        console.log(`Error: ${error}`)
        res.status(500).json({ message: "Internal server error" })
    }
})

users.post("/login", async (req, res) => {
    console.log(JSON.stringify(req.body))
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).json({ status: "error", message: "Missing username or password" });
    }

    // Find user with username  
    const user = await prisma.user.findUnique({
        where: { userName: username }
    })

    if (!user) {
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
    res.json({ status: "success" })

})

users.get("/me", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    res.json({
        status: "success",
        data: {
            user: {
                userName: user!.userName,
                isAdmin: user!.roles.includes("ADMIN")
            }
        }
    })
})