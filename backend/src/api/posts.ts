
import express from "express";
import Joi from "joi";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const posts = express.Router();

/**
 * POST /api/posts
 */
posts.post("/", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const schema = Joi.object<{
        title: string;
        message: string;
        isPrivate: boolean
    }>({
        title: Joi.string().required(),
        message: Joi.string().required(),
        isPrivate: Joi.boolean().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: `Validation failed: ${error.message}` });
    }

    const { title, message, isPrivate } = value

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
                },
                private: isPrivate
            },
            include: { messages: true }
        })

        return res.status(200).json({
            id: post.id,
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /api/posts/:id
 */
posts.get("/:postId", async (req, res, next) => {

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (Number.isNaN(postIdAsNumber)) {
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
                owner: post.author.username,
                isPrivate: post.private,
                creationDate: post.createdAt,
                lastModificationDate: post.updatedAt
            }
        })
    } catch (error) {
        next(error)
    }
})

/**
 * GET /posts?page=2
 */
posts.get("/", async (req, res, next) => {
    const limit = 10
    const { page = 1 } = req.query

    const schema = Joi.object({
        page: Joi.number().integer().min(1).required()
    })

    const { error, value } = schema.validate({ page: Number(page) })

    if (error) {
        return res.status(422).json({ message: `Validation failed: ${error.message}` })
    }

    try {
        const posts = await prisma.post.findMany({
            skip: (Number(value.page) - 1) * Number(limit),
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
                owner: post.author.username,
                isPrivate: post.private,
                creationDate: post.createdAt,
                lastModificationDate: post.updatedAt
            }))
        })
    } catch (error) {
        next(error)
    }
})

/**
 * PATCH /api/posts/:id
 */
posts.patch("/:postId", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (Number.isNaN(postIdAsNumber)) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    const schema = Joi.object<{
        title?: string;
        isPrivate?: boolean
    }>({
        title: Joi.string().optional(),
        isPrivate: Joi.boolean().optional()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: `Validation failed: ${error.message}` });
    }

    const { title, isPrivate } = value

    if (title === undefined && isPrivate === undefined) {
        return res.status(422).json({ message: `Validation failed: body is required` });
    }

    const post = await prisma.post.findUnique({
        where: { id: postIdAsNumber }
    })

    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    // Check user is owner of the post
    if (userId !== post.authorId) {
        return res.status(403).json({ message: "Forbidden, you are not the owner of the post" })
    }

    try {
        const postUpdated = await prisma.post.update({
            where: { id: postIdAsNumber },
            data: {
                title: title,
                private: isPrivate
            },
            include: { author: true }
        })

        return res.status(200).json({
            post: {
                id: postUpdated.id,
                title: postUpdated.title,
                owner: postUpdated.author.username,
                isPrivate: postUpdated.private,
                creationDate: postUpdated.createdAt,
                lastModificationDate: postUpdated.updatedAt
            }
        })
    } catch (error) {
        next(error)
    }
})