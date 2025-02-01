import fs from 'fs';

export class CarstManager {
	static #path = '';
	static setPath(rutaArchivo = '') {
		this.#path = rutaArchivo;
	}
	static async getCarts() {
		if (fs.existsSync(this.#path)) {
			return JSON.parse(
				await fs.promises.readFile(this.#path, { encoding: 'utf-8' })
			);
		} else {
			return [];
		}
	}

	static async getCartsById(cid) {
		let carts = await this.getCarts();
		let cart = carts.find((c) => c.id === cid);

		return cart;
	}

	static async addCart() {
		let carts = await this.getCarts();

		let id = 1;
		if (carts.length > 0) {
			id = carts[carts.length - 1].id + 1;
		}

		let newCart = {
			id,
			products: [],
		};
		carts.push(newCart);
		await this.#fileRecord(JSON.stringify(carts, null, 5));
		return newCart;
	}

	static async addProductToCart(cid, pid) {
		let carts = await this.getCarts();
		let cart = carts.find((cart) => cart.id === cid);

		if (!cart) {
			throw new Error(`No se encontró el cart con id ${cid}`);
		}

		let exist = cart.products.find((product) => product.product === pid);

		if (exist) {
			exist.quantity++;
		} else {
			cart.products.push({ product: id, quantity: 1 });
		}

		await this.#fileRecord(JSON.stringify(carts, null, 5));
		return cart;
	}

	static async #fileRecord(data = '') {
		if (typeof data != 'string') {
			throw new Error(`Error en fileRecord- Argumento con formato inválido`);
		}
		await fs.promises.writeFile(this.#path, data);
	}
}
