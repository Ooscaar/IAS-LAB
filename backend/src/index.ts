
import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { messages, posts, users } from "./api";

const app = express();
const port = 3000;

app.use(morgan("combined"))
app.use(cookieParser())
app.use(express.json())

app.use("/api/users", users)
app.use("/api/posts", posts)
app.use("/api/messages", messages)


app.listen(port, () => {
    console.log(`[*] Server listening on port ${port}`);
});
