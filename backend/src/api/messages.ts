import express from "express";
import { prisma } from "../client";

export const messages = express.Router();

/**
 * GET /api/messages/:postId
 */
messages.get("/:postId", async (req, res) => {
    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (postIdAsNumber === NaN) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    const post = await prisma.post.findUnique({
        where: { id: postIdAsNumber },
        include: {
            messages: { include: { author: true } }
        }
    })

    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    res.status(200).json({
        messages: post.messages.map(message => ({
            id: message.id,
            owner: message.author.userName,
            content: message.content
        }))
    })
})


/**
 * POST /api/messages/:postId
 */
messages.post("/:postId", async (req, res) => {
    const userId = (req as any).userId

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (postIdAsNumber === NaN) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    const { message } = req.body as { message: string };

    if (!message) {
        res.status(422).json({ message: "Missing message" });
    }

    const post = await prisma.post.findUnique({
        where: { id: postIdAsNumber },
    })

    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    await prisma.message.create({
        data: {
            content: message,
            authorId: userId,
            postId: postIdAsNumber
        }
    })

    res.status(200).send()
})