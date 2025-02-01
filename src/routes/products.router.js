import { Router } from 'express';
import { ProductsDaoMongo } from '../dao/ProductsDaoMongo.js';
import { processErrors } from '../utils.js';
import { isValidObjectId } from 'mongoose';
export const router = Router();

router.get('/', async (req, res) => {
	try {
		let products = await ProductsDaoMongo.getProducts();

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ products });
	} catch (error) {
		processErrors(res, error);
	}
});

router.get('/:pid', async (req, res) => {
	let { pid } = req.params;

	if (!isValidObjectId(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res
			.status(400)
			.json({ error: `Se requiere un id de mongodb válido` });
	}

	try {
		let product = await ProductsDaoMongo.getProductBy(pid);

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({ product });
	} catch (error) {
		processErrors(res, error);
	}
});

router.post('/', async (req, res) => {
	let { code, title, ...otros } = req.body;
	if (!code || !title) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `Code y title son requeridos` });
	}

	try {
		let existTitle = await ProductsDaoMongo.getProductBy({ title });
		if (existTitle) {
			res.setHeader('Content-Type', 'application/json');
			return res
				.status(400)
				.json({ error: `El producto con title: ${title} ya existe en DB` });
		}
		let existCode = await ProductsDaoMongo.getProductBy({ code });
		if (existCode) {
			res.setHeader('Content-Type', 'application/json');
			return res
				.status(400)
				.json({ error: `El producto con code ${code} ya existe en DB` });
		}

		let newProduct = await ProductsDaoMongo.addProduct({
			code,
			title,
			...otros,
		});

		res.setHeader('Content-Type', 'application/json');
		return res
			.status(201)
			.json({ payload: `Producto agregado exitosamente`, newProduct });
	} catch (error) {
		processErrors(res, error);
	}
});

router.put('/:pid', async (req, res) => {
	let { pid } = req.params;

	if (!isValidObjectId(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res
			.status(400)
			.json({ error: `Se requiere un id de mongodb válido` });
	}

	let toModify = req.body;

	if (toModify.pid) {
		res.setHeader('Content-Type', 'application/json');
		return res.status(400).json({ error: `No está permitido modificar id` });
	}

	try {
		let modifiedProduct = await ProductsDaoMongo.updateProduct(pid, toModify);

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			payload: `Se modició el producto con id ${pid}`,
			modifiedProduct,
		});
	} catch (error) {
		processErrors(res, error);
	}
});

router.delete('/:pid', async (req, res) => {
	let { pid } = req.params;

	if (!isValidObjectId(pid)) {
		res.setHeader('Content-Type', 'application/json');
		return res
			.status(400)
			.json({ error: `Se requiere un id de mongodb válido` });
	}

	try {
		let deletedProduct = await ProductsDaoMongo.deleteProduct(pid);

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			payload: `Producto con id ${pid} eliminado exitosamente`,
			deletedProduct,
		});
	} catch (error) {
		processErrors(res, error);
	}
});
