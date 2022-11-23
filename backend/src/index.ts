
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import { messages, posts, users } from "./api";

const app = express();
const port = 8080;

app.use(morgan("combined"))
app.use(cookieParser())
app.use(express.json())

// Static files from frontend folder
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/", (req, res) => {
    // Serve index.html
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});


app.use("/api/users", users)
app.use("/api/posts", posts)
app.use("/api/messages", messages)

app.listen(port, () => {
    console.log(`[*] Server listening on port ${port}`);
});
