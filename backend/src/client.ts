import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
        {
            emit: "stdout",
            level: "error",
        },
    ],
})

prisma.$on("query", (e) => {
    console.log("**************************")
    console.log(`| Query: ${e.query}`)
    console.log(`| Duration: ${e.duration} ms`)
    console.log("**************************")
})

