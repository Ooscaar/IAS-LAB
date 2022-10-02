
import express from "express";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const posts = express.Router();

/**
 * POST /api/posts
 */
posts.post("/", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const { title, message } = req.body as { title: string, message: string };

    if (!title || !message) {
        return res.status(422).json({ message: "Missing title or message" });
    }

    try {
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

        return res.status(200).json({
            post: {
                title: post.title,
                message: post.messages[0].content
            }
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /api/posts/:id
 */
posts.get("/:postId", sessionMiddleware, async (req, res, next) => {

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (postIdAsNumber === NaN) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postIdAsNumber },
            include: { author: true }
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.status(200).json({
            post: {
                id: post.id,
                title: post.title,
                owner: post.author.userName
            }
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /posts?page=2
 */
posts.get("/", sessionMiddleware, async (req, res, next) => {
    const limit = 10
    const { page = 1 } = req.query

    try {
        const posts = await prisma.post.findMany({
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { updatedAt: "desc" },
            include: {
                author: true
            }
        })

        return res.status(200).json({
            posts: posts.map(post => ({
                id: post.id,
                title: post.title,
                owner: post.author.userName
            }))
        })
    } catch (error) {
        next(error)
    }
})