import { Router } from 'express';

import { ProductManager } from '../dao/ProductManager.js';
import { processErrors } from '../utils.js';

export const router = Router();

ProductManager.setPath('./src/data/productos.json');

router.get('/', async (req, res) => {
	try {
		let products = await ProductManager.getProducts();

		let {limit}= req.query
		if (limit) {
			products= products.slice(0, limit)
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ products });
	} catch (error) {
		processErrors(res, error);
	}
});

router.get('/:pid', async (req, res) => {
	let { pid } = req.params;
	pid = Number(pid);
	if (isNaN(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Se requiere un id numérico` });
	}

	try {
		let product = await ProductManager.getProductsById(pid);
		if (!product) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({ error: `No existe product con id ${pid}` });
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ product });
	} catch (error) {
		processErrors(res, error);
	}
});

router.post('/', async (req, res) => {
	let { title, description, price, code, stock, status, category} = req.body;
	if (!title || !description || !price || !code || !stock || !status|| !category) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Todos los campos del producto son requeridos a excepción de thumbnail` });
	}

	try {
		let exist = await ProductManager.getProductByTitle(title);
		if (exist) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({ error: `Ya existe ${title} en DB` });
		}

		let newProduct = await ProductManager.addProduct({ title, description, price, code, stock, status, category });

		req.socket.emit("newProduct", newProduct)

		res.setHeader('Content-Type', 'application/json');
		return res
			.status(201)
			.json({ payload: `Producto agregado exitosamente`, newProduct });
	} catch (error) {
		processErrors(res, error);
	}
});

router.put("/:pid", async (req, res) => {
	let { pid } = req.params;
	pid = Number(pid);
	if (isNaN(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Se requiere un id numérico` });
	}

	let toModify = req.body;

	 if (toModify.pid) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `No está permitido modificar id` });
	} 

	try {
		 if (toModify.title) {
			let products = await ProductManager.getProducts();
			let exist = products.find(p =>p.title.toLowerCase() === toModify.title.trim().toLowerCase() && p.pid != pid
			);
			if (exist) {
				res.setHeader('Content-Type', 'application/json');
				return res
					.status(400)
					.json({
						error: `Ya existe un producto con title ${toModify.title} en DB. Tiene id ${exist.pid}`,
					});
			}
		} 

		let modifiedProduct = await ProductManager.modifyProduct(pid, toModify);

		res.setHeader('Content-Type', 'application/json');
		return res
			.status(200)
			.json({
				payload: `Se modició el producto con id ${pid}`,
				modifiedProduct,
			});
	} catch (error) {
		processErrors(res, error);
	}
});

router.delete('/:pid', async(req, res) => {

	let { pid } = req.params;
	pid = Number(pid);
	if (isNaN(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Se requiere un id numérico` });
	}

	try {

		let deletedProduct = await ProductManager.deleteProductById(pid);

		req.socket.emit("deletedProduct", deletedProduct)

		if(!deletedProduct) {
			return res.status(404).json({ error: `No se encontró el producto con id ${pid}` })
		}
		
		

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ payload: `Producto con id ${pid} eliminado exitosamente`});
	} catch (error) {
		processErrors(res, error);
	}

});
