import cors from "cors"
import express, { Request, Response } from "express"
import dotenv from "dotenv"
import watchRouter from "./routes/watch.route"

dotenv.config()

const port = process.env.PORT || 8082
const app = express();

app.use(cors({
    allowedRoutes: ["*"],
    origin: ["*"]
}))

app.use(express.json())

app.use('/watch', watchRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Fullstack youtube clone watch service')
})

app.listen(port, () => {
    console.log("✅Server running on http://localhost:8082")
})