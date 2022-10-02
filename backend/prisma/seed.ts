import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { SALT_ROUNDS } from '../src/const'
const prisma = new PrismaClient({
    log: ["query", "info", "warn"],
})

async function main() {
    const userPassword = await hash('123456', SALT_ROUNDS)
    const user = await prisma.user.upsert({
        where: { username: 'jesus2000' },
        update: {},
        create: {
            username: 'jesus2000',
            password: userPassword,
            roles: ["USER"],
            posts: {
                create: {
                    title: 'Zero knowledge proof',
                    content: 'Zero knowledge proof is a cryptographic protocol that allows a prover to prove to a verifier that they know a value x without revealing any information besides the fact that they know x. This is done by having the prover send a commitment to x to the verifier, and then having the prover send a proof that they know x without revealing x. The verifier can then verify that the prover knows x without learning anything about x.',
                    messages: {
                        create: {
                            content: 'This is a message',
                            author: { connect: { username: 'jesus2000' } }
                        }
                    }

                },
            },
        },
        include: {
            posts: true,
        }
    })

    const adminPassword = await hash('123456', SALT_ROUNDS)
    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: adminPassword,
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