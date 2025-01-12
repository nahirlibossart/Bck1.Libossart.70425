import express from "express"
import { engine } from "express-handlebars";
import {router as vistasRouter} from "./routes/views.router.js" 
import { router as productsRouter} from "./routes/products.router.js"
import { router as cartsRouter} from "./routes/carts.router.js" 

import { Server } from "socket.io";

const PORT=8080;

let io

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/", vistasRouter)
app.use("/realtimeproducts",
    (req, res, next) => {
        req.socket= io
        next()
    },
    productsRouter
)

app.use(
    "/api/products", 
    (req, res, next) => {
        req.socket= io
        next()

    },
    productsRouter)

app.use("/api/carts", cartsRouter) 

const server= app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

io=new Server(server) 