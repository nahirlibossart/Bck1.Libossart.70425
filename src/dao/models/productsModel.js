import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
	{
		title: { type: String, unique: true },
		description: String,
		price: Number,
		thumbnail: {
			type: Array,
			default: [],
		},
		code: {
			type: String,
			unique: true,
		},
		stock: Number,
		status: {
			type: Boolean,
			default: true,
		},
		category: String,
	},
	{
		timestamps: true,
	}
);

productSchema.plugin(paginate);

export const productsModel = mongoose.model('products', productSchema);
