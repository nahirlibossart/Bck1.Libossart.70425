import { Router } from 'express';
import { CartsDaoMongo as CartsManager } from '../dao/CartsDaoMongo.js';
import { ProductsDaoMongo as ProductManager } from '../dao/ProductsDaoMongo.js';
import { processErrors } from '../utils.js';

export const router = Router();

router.get('/', async (req, res) => {
	try {
		let carts = await CartsManager.getCarts();
		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ carts });
	} catch (error) {
		processErrors(res, error);
	}
});

router.post('/', async (req, res) => {
	let { name, code } = req.body;
	if (!name || !code) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Name y code son requeridos` });
	}

	try {
		let carts = await CartsManager.getCarts();

		let existCode = carts.find((c) => c.code == code);
		if (existCode) {
			res.setHeader('Content-Type', 'application/json');
			return res
				.status(400)
				.json({ error: `El carrito con code ${code} ya existe en DB` });
		}

		let existName = carts.find((c) => c.name == name);
		if (existName) {
			res.setHeader('Content-Type', 'application/json');
			return res
				.status(400)
				.json({ error: `El carrito con name ${name} ya existe en DB` });
		}

		let newCart = await CartsManager.addCart({ name, code });
		res.setHeader('Content-Type', 'application/json');
		return res
			.status(201)
			.json({ message: `Carrito creado exitosamente`, newCart });
	} catch (error) {
		processErrors(error, res);
	}
});

router.post('/:cid/product/:pid', async (req, res) => {
	let { cid, pid } = req.params;

	try {
		let productsResult = await ProductManager.getProducts();
		let products = productsResult.docs;

		let product = products.find((p) => p._id.toString() === pid);
		if (!product) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}

		let carts = await CartsManager.getCarts();
		let cart = carts.find((c) => c._id.toString() === cid);
		if (!cart) {
			return res.status(404).json({ error: 'Carrito no encontrado' });
		}

		let addedProductIndex = cart.addedProduct.findIndex(
			(a) => a.product.toString() === pid
		);

		if (addedProductIndex === -1) {
			cart.addedProduct.push({
				product: pid,
				readded: 1,
			});
		} else {
			cart.addedProduct[addedProductIndex].readded++;
		}

		await CartsManager.modifyCart(cid, cart);
		return res
			.status(200)
			.json({ message: 'Producto agregado exitosamente', cart });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
});

router.put('/:cid', async (req, res) => {
	let { cid } = req.params;
	let addedProduct = req.body;

	try {
		let products = await ProductManager.getProducts();
		let carts = await CartsManager.getCarts();
		let cart = carts.find((c) => c._id == cid);

		if (!cart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({ error: `Error con carrito` });
		}

		if (!Array.isArray(addedProduct)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: `Debe enviar un array válido de productos por el body`,
			});
		}

		let error = false;
		let productsBody = [];

		addedProduct.forEach((p) => {
			if (!p.id) {
				console.log(`El objeto no tiene propiedad id`);
				error = true;
			} else {
				let existProduct = products.find((product) => product._id == p.id);
				if (!existProduct) {
					console.log(`No existe producto con id ${p.id}`);
					error = true;
				} else {
					if (productsBody.includes(p.id)) {
						error = true;
						console.log(`Algún id de producto está repetido en el body`);
					} else {
						productsBody.push(p.id);
					}
				}
			}
			if (!p.readded) p.readded = 0;
		});

		if (error) {
			res.setHeader('Content-Type', 'application/json');
			return res
				.status(400)
				.json({ error: `Hay un error en alguno de los productos` });
		}

		addedProduct = addedProduct.map((p) => {
			return {
				product: p.id,
				readded: p.readded,
			};
		});

		cart.addedProduct = addedProduct;

		let modifiedCart = await CartsManager.modifyCart(cid, cart);
		res.setHeader('Content-Type', 'application/json');
		return res
			.status(200)
			.json({
				payload: modifiedCart,
				message: `Producto agregado exitosamente`,
			});
	} catch (error) {
		processErrors(error, res);
	}
});

router.delete('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		// Obtener el carrito por su ID
		const carts = await CartsManager.getCarts();
		const cart = carts.find((c) => c._id.toString() === cid);

		if (!cart) {
			return res
				.status(404)
				.json({ error: `Carrito con ID ${cid} no encontrado` });
		}

		// Verificar si el producto existe en el carrito
		const productIndex = cart.addedProduct.findIndex(
			(item) => item.product.toString() === pid
		);

		if (productIndex === -1) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${pid} no encontrado en el carrito` });
		}

		cart.addedProduct.splice(productIndex, 1);

		await CartsManager.modifyCart(cid, cart);
		console.log(`Producto con id ${pid} eliminado del carrito`);

		return res.status(200).json({
			message: `Producto con id ${pid} eliminado del carrito`,
			cart,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
});
