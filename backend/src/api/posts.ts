
import express from "express";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const posts = express.Router();

posts.post("/", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    const { title, message } = req.body as { title: string, message: string };

    if (!title || !message) {
        res.status(422).json({ status: "error", message: "Missing title or message" });
    }

    // Do not restric the title while creating a post
    const post = await prisma.post.create({
        data: {
            title: title,
            authorId: userId,
            messages: {
                create: {
                    content: message,
                    authorId: userId
                }
            }
        },
        include: { messages: true }
    })

    res.status(200).json({
        status: "success",
        data: {
            post: {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                messages: post.messages.map(message => ({
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                }))
            }
        }
    })
})

posts.get("/:id", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    const { id: postId } = req.params

    const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
        include: { messages: true }
    })

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post not found" })
    }

    res.status(200).json({
        status: "success",
        data: {
            post: {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                messages: post.messages.map(message => ({
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                }))
            }
        }
    })
})