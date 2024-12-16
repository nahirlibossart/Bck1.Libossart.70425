import {Router} from "express"

import { CarstManager } from "../dao/CartsManager.js";
import { processErrors } from '../utils.js';

export const router=Router()

CarstManager.setPath('./src/data/carrito.json')

router.get("/", async(req, res)=>{

    try {
		let carts = await CarstManager.getCarts();
		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ carts });
	} catch (error) {
		processErrors(res, error)
	}

})

router.get("/:cid", async(req, res)=>{

    let { cid } = req.params;
        cid = Number(cid);

        if (isNaN(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Se requiere un id numérico` });
        }
    
        try {
            let cart = await CarstManager.getCartsById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existe cart con id ${cid}` });
            }
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ cart });
        } catch (error) {
            processErrors(res, error);
        }

})

router.post("/", async(req, res)=>{

    try {
		let newCart = await CarstManager.addCart();
		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({ payload: "Carrito creado exitosamente", newCart });
	} catch (error) {
		processErrors(res, error)
	}
    
})

router.post("/:cid/product/:pid", async (req, res) => {
	let { cid, pid } = req.params;
	cid = Number(cid);
	pid = Number(pid);

	if (isNaN(cid) || isNaN(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Se requieren ids numéricos` });
	}

	try {
		let updatedCart = await CarstManager.addProductToCart(cid, pid);
		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ payload: `Producto agregado al carrito`, updatedCart });
	} catch (error) {
		processErrors(res, error)
	}
});


router.put("/:id", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:`put a carts`});
})

router.delete("/:id", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:`delete a carts`});
})