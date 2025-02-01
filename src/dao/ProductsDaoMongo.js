import { productsModel } from './models/productsModel.js';

export class ProductsDaoMongo {
	static async getProducts(page) {
		return productsModel.paginate(
			{},
			{
				limit: 10,
				page,
				lean: true,
			}
		);
	}

	static async getProductBy(filter = {}) {
		return await productsModel.findOne(filter).lean();
	}

	static async addProduct(product = {}) {
		let newProduct = await productsModel.create(product);
		return newProduct.toJSON();
	}

	static async updateProduct(pid, toModify = {}) {
		return await productsModel
			.findByIdAndUpdate(pid, toModify, { new: true })
			.lean();
	}

	static async deleteProduct(pid) {
		let deletedProduct = await productsModel.findByIdAndDelete(pid).lean();
		return deletedProduct;
	}
}
