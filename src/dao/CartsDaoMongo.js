import { cartsModel } from './models/cartsModel.js';

export class CartsDaoMongo {
	static async getCarts() {
		return await cartsModel.find().populate('addedProduct.product').lean();
	}

	static async getCartsBy(filter = {}) {
		return await cartsModel.findOne(filter).lean();
	}

	static async addCart(cart = {}) {
		let newCart = await cartsModel.create({ ...cart, addedProduct: [] });

		return newCart.toJSON();
	}

	static async modifyCart(id, toModify = {}) {
		return await cartsModel.findByIdAndUpdate(id, toModify, { new: true });
	}
}
