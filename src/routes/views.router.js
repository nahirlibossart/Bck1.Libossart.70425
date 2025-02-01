import { Router } from 'express';
import { CartsDaoMongo as CartsManager } from '../dao/CartsDaoMongo.js';
import { ProductsDaoMongo as ProductManager } from '../dao/ProductsDaoMongo.js';
import { processErrors } from '../utils.js';
export const router = Router();


router.get('/', async (req, res) => {
res.render('home');
});

router.get('/carts', async (req, res) => {
    try {
        let carts = await CartsManager.getCarts();

        res.render('carts', {
            carts,
        });
    } catch (error) {
        processErrors(error, res);
    }
});

 router.get('/cart/:cid', async (req, res) => {
    try {
        let products = await ProductManager.getProducts();
        let carts = await CartsManager.getCarts();
        let cart = carts.find((c) => c._id == req.params.cid);

        if(!cart){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existen carritos con id ${req.params.cid}`})
        }

        res.render("cart", {
            cart,
            products: products.docs,
        })
    } catch (error) {
        processErrors(error, res)
    }

}) 

router.get('/products', async(req,res)=> {

    try {
        let { page }= req.query

        if(!page) {
            page= 1
        }
       
        let {docs: products,
            totalPages,
            hasPrevPage,
            prevPage,
            hasNextPage,
            nextPage
        }= await ProductManager.getProducts(page)    
        console.log(products)
   
        return res.status(200).render(
            "products",
            {
                products,
                totalPages,
                hasPrevPage,
                prevPage,
                hasNextPage,
                nextPage
            }
        )
    }
    catch (error) {
        processErrors(error, res)
    }
})