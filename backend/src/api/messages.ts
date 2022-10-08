import express from "express";
import Joi from "joi";
import { prisma } from "../client";
import { sessionMiddleware } from "../middlewares/session.middleware";

export const messages = express.Router();

/**
 * GET /api/messages/:postId
 */
messages.get("/:postId", sessionMiddleware, async (req, res, next) => {
    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (Number.isNaN(postIdAsNumber)) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postIdAsNumber },
            include: {
                messages: {
                    include: { author: true },
                    orderBy: { createdAt: "asc" }
                }
            },
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const userId = (req as any).userId

        // Private posts can only be accessed by the authenticated users
        if (!userId && post.private) {
            return res.status(401).json({ message: "Unauthorized: post is private" })
        }

        return res.status(200).json({
            messages: post.messages.map(message => ({
                id: message.id,
                owner: message.author.username,
                content: message.content,
                creationDate: message.createdAt,
                lastModificationDate: message.updatedAt
            }))
        })
    } catch (error) {
        next(error)
    }
})


/**
 * POST /api/messages/:postId
 */
messages.post("/:postId", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const { postId } = req.params

    const postIdAsNumber = Number(postId)

    if (Number.isNaN(postIdAsNumber)) {
        return res.status(422).json({ message: "Invalid post id" })
    }

    const schema = Joi.object<{
        message: string;
    }>({
        message: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: `Validation failed: ${error.message}` });
    }

    const { message } = value

    try {
        const post = await prisma.post.findUnique({
            where: { id: postIdAsNumber },
        })

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const messageCreated = await prisma.message.create({
            data: {
                content: message,
                authorId: userId,
                postId: postIdAsNumber
            }
        })

        // Update post lastModificationDate also
        await prisma.post.update({
            where: {
                id: postIdAsNumber
            },
            data: {
                updatedAt: messageCreated.updatedAt
            }
        })

        return res.status(200).send()
    } catch (error) {
        next(error)
    }
})