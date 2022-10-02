import { Session } from "@prisma/client";
import express from "express";
import { prisma } from "../client";

/**
 * session middleware checks if the sessionId cookie is valid 
 */
export async function sessionMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const sessionId = req.cookies["sessionId"]

    if (!sessionId) {
        return res.status(401).json({ status: "error", message: "Unauthorized: sessionId cookie not set up" })
    }

    try {
        // Find user with session cookie
        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        })

        if (!session) {
            return res.status(401).json({ message: "Unauthorized: sessionId not found" })
        }

        const now = new Date()
        const expires = new Date(session.expires)

        if (now > expires) {
            await prisma.session.delete({
                where: { id: sessionId }
            })
            return res.status(401).json({ message: "Unauthorized: sessionId expired" })
        }

        // Add userId to global request object
        (req as any).userId = session.userId

        next()
    } catch (error) {
        next(error)
    }

}
