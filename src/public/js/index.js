import { Socket } from "socket.io";

const socket= io()

socket.on("newProduct", product => {
    alert(`Alguien ha agregado un producto: ${product.title}`)
}) 

socket.on("deletedProduct", product => {
    alert(`Alguien ha eliminado un producto: ${product.title}`)
}) 