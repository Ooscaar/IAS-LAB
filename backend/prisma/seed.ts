import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.upsert({
        where: { userName: 'jesus2000' },
        update: {},
        create: {
            userName: 'jesus2000',
            password: '123456',
            roles: ["USER"],
            posts: {
                create: {
                    title: 'Zero knowledge proof',
                    content: 'Zero knowledge proof is a cryptographic protocol that allows a prover to prove to a verifier that they know a value x without revealing any information besides the fact that they know x. This is done by having the prover send a commitment to x to the verifier, and then having the prover send a proof that they know x without revealing x. The verifier can then verify that the prover knows x without learning anything about x.',
                },
            },
        },
        include: {
            posts: true,
        }
    })

    const message = await prisma.message.create({
        data: {
            content: 'Message',
            authorId: user.id,
            postId: user.posts[0].id,
        }
    })

    const admin = await prisma.user.upsert({
        where: { userName: "admin" },
        update: {},
        create: {
            userName: "admin",
            password: "123456",
            roles: ["ADMIN", "USER"],
        }
    })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })