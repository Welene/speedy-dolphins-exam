import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true,
		},
		cartId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			// inte required, om man vill beställa som guest
		},
		guestId: {
			type: String,
			// använder guestId om userId inte finns
			// (logiken finns i routes - orders.js)
		},
		products: [
			{
				prodId: String,
				qty: Number,
				title: String,
				price: Number,
			},
		],
		total: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
