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

        if (post.deleted) {
            return res.status(400).json({ message: "Post is deleted" })
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
                content: message.deleted ?
                    undefined :
                    message.content,
                creationDate: message.createdAt,
                isDeleted: message.deleted,
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

        if (post.deleted) {
            return res.status(400).json({ message: "Post is deleted, can not create new message" })
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

/**
 * PATCH /api/messages/:messageId
 */
messages.patch("/:messageId", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const { messageId } = req.params

    const messageIdAsNumber = Number(messageId)

    if (Number.isNaN(messageIdAsNumber)) {
        return res.status(422).json({ message: "Invalid message id" })
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
        const messageToModify = await prisma.message.findUnique({
            where: { id: messageIdAsNumber },
            include: { post: true }
        })

        if (!messageToModify) {
            return res.status(404).json({ message: "Message not found" })
        }

        if (messageToModify.post.deleted) {
            return res.status(400).json({ message: "Post is deleted" })
        }

        if (messageToModify.deleted) {
            return res.status(400).json({ message: "Message is deleted" })
        }


        // Check user is owner of the post
        if (userId !== messageToModify.authorId) {
            return res.status(403).json({ message: "Forbidden, you are not the owner of the message" })
        }

        const messageUpdated = await prisma.message.update({
            where: { id: messageIdAsNumber },
            data: {
                content: message,
            }
        })

        // Update post lastModificationDate also
        await prisma.post.update({
            where: {
                id: messageUpdated.postId
            },
            data: {
                updatedAt: messageUpdated.updatedAt
            }
        })

        return res.status(200).send()
    } catch (error) {
        next(error)
    }
})

/**
 * DELETE /api/messages/:id
 */
messages.delete("/:messageId", sessionMiddleware, async (req, res, next) => {
    const userId = (req as any).userId

    const { messageId } = req.params

    const messageIdAsNumber = Number(messageId)

    if (Number.isNaN(messageIdAsNumber)) {
        return res.status(422).json({ message: "Invalid message id" })
    }

    try {
        const message = await prisma.message.findUnique({
            where: { id: messageIdAsNumber },
            include: { post: true }
        })

        if (!message) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (message.post.deleted) {
            return res.status(400).json({ message: "Post is deleted" })
        }

        if (message.deleted) {
            return res.status(400).json({ message: "Message is deleted" })
        }

        // Owners and admin can delete posts
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const allowedToDelete =
            user!.roles.includes("ADMIN") ||
            userId === message.authorId ||
            userId === message.post.authorId

        if (!allowedToDelete) {
            return res.status(403).json({ message: "Forbidden, no permissions to delete the post" })
        }

        const messageUpdated = await prisma.message.update({
            where: { id: messageIdAsNumber },
            data: {
                deleted: true
            }
        })

        // Update post lastModificationDate also
        await prisma.post.update({
            where: {
                id: messageIdAsNumber
            },
            data: {
                updatedAt: messageUpdated.updatedAt
            }
        })

        return res.status(200).json({
            id: message.id,
        })
    } catch (error) {
        next(error)
    }
})