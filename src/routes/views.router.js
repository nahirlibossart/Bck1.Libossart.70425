import { Router } from 'express';
import { ProductManager } from '../dao/ProductManager.js';
export const router=Router()

router.get('/', async(req,res)=>{

    res.render("home")
})

router.get('/index', async(req,res)=>{

    let products= await ProductManager.getProducts()

    res.render("index", {
        products
    })
})

router.get('/realtimeproducts', async(req,res)=>{

    res.render("realtimeproducts")
})
