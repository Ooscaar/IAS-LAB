import express from "express";

export const messages = express.Router();

messages.post("/register", async (req, res) => {
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        res.status(422).json({ status: "error", message: "Missing username or password" });
    }
})