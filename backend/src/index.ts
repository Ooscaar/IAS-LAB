
import express from "express"
import morgan from "morgan"
import { prisma } from "./client";

const app = express();
const port = 3000;

app.use(morgan("combined"))

/**************************************
 *  USERS
 *************************************/
app.post("/api/users/register", async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).send("Missing username or password");
    }

    // Create new user
    try {
        const user = await prisma.user.create({
            data: {
                userName: username,
                password: password
            }
        })

        // Send 201 status code
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    userName: user.userName,
                    roles: user.roles
                }
            }
        })
    } catch (error) {
        // General for now
        console.log(`Error: ${error}`)
        res.status(500).json({ message: "Internal server error" })
    }
});

app.get("/api/*", (req, res) => {
    res.json({ message: "/api/*:Hello World!" });
});

/**************************************
 *  POSTS
 *************************************/

/**************************************
 *  MESSAGES
 *************************************/

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
