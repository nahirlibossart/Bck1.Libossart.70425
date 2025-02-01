import mongoose from 'mongoose';

export const cartsModel = mongoose.model(
	'carts',
	new mongoose.Schema(
		{
			name: String,
			code: { type: String, unique: true },
			addedProduct: {
				type: [
					{
						product: {
							type: mongoose.Schema.Types.ObjectId,
							ref: 'products',
						},
						readded: {
							type: Number,
							default: 0,
						},
					},
				],
			},
		},
		{
			timestamps: true,
		}
	)
);
