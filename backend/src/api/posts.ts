
import express from "express";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const posts = express.Router();

/**
 * POST /api/posts
 */
posts.post("/", sessionMiddleware, async (req, res) => {
    const userId = (req as any).userId

    const { title, message } = req.body as { title: string, message: string };

    if (!title || !message) {
        res.status(422).json({ message: "Missing title or message" });
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
        post: {
            title: post.title,
            message: post.messages[0].content
        }
    })
})

/**
 * GET /api/posts/:id
 */
posts.get("/:postId", sessionMiddleware, async (req, res) => {

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (postIdAsNumber === NaN) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    const post = await prisma.post.findUnique({
        where: { id: postIdAsNumber },
        include: { author: true }
    })

    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    res.status(200).json({
        post: {
            id: post.id,
            title: post.title,
            owner: post.author.userName
        }
    })
})

/**
 * GET /posts?page=2
 */
posts.get("/", sessionMiddleware, async (req, res) => {
    const limit = 10
    const { page = 1 } = req.query

    const posts = await prisma.post.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { updatedAt: "desc" },
        include: {
            author: true
        }
    })

    res.status(200).json({
        posts: posts.map(post => ({
            id: post.id,
            title: post.title,
            owner: post.author.userName
        }))
    })
})