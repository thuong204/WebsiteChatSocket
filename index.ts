import express, {Express,Request, Response } from 'express';
import clientRoutes from "./routes/client/index.route"

const app:Express = express()

const port = process.env.PORT || 3000

app.use(express.static(`${__dirname}/public`))
app.set("views",`${__dirname}/views`);
app.set("view engine","pug")
clientRoutes(app)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})
