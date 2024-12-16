import fs from 'fs';

export class ProductManager {
	static #path = '';
	static setPath(rutaArchivo = '') {
		this.#path = rutaArchivo;
	}
	static async getProducts() {
		if (fs.existsSync(this.#path)) {
			return JSON.parse(
				await fs.promises.readFile(this.#path, { encoding: 'utf-8' })
			);
		} else {
			return [];
		}
	}

	static async getProductsById(pid) {
		let products = await this.getProducts();
		let product = products.find((p) => p.id === pid);

		return product;
	}

	static async getProductByTitle(title) {
		let products = await this.getProducts();
		let product = products.find(
			(p) => p.title.toLowerCase() === title.trim().toLowerCase()
		);
		return product;
	}
	static async addProduct(product = {}) {
		let products = await this.getProducts();

		let id = 1;
		if (products.length > 0) {
			id = products[products.length - 1].id + 1;
		}

		let newProduct = {
			id,
			...product,
		};
		products.push(newProduct);
		await this.#fileRecord(JSON.stringify(products, null, 5));
		return newProduct;
	}

	static async modifyProduct(pid, modifications = {}) {
		let products = await this.getProducts();
		let indexProduct = products.findIndex(p => p.pid === pid);
		if (indexProduct === -1) {
			throw new Error(`No existe product con id ${pid}`);
		}

		products[indexProduct] = {
			...products[indexProduct],
			...modifications,
			pid,
		};

		await this.#fileRecord(JSON.stringify(products, null, 5));
		return products[indexProduct];
	}

	static async deleteProductById(pid) {
		let products = await this.getProducts();
		let deletedProduct = products.find((p) => p.pid === pid);

		await this.#fileDelete(pid)

		return deletedProduct;
	}

	static async #fileRecord(data = '') {
		if (typeof data != 'string') {
			throw new Error(`Error en fileRecord- Argumento con formato inválido`);
		}
		await fs.promises.writeFile(this.#path, data);
	}

	static async #fileDelete(pid) {
		let products = await this.getProducts();
		let updatedProducts = products.filter((p) => p.pid !== pid);
		await this.#fileRecord(JSON.stringify(updatedProducts, null, 5));
	}
}
