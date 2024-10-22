import express, {Express,Request, Response } from 'express';
import clientRoutes from "./routes/client/index.route"

const app:Express = express()

const port = process.env.PORT || 3000

clientRoutes(app)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})
