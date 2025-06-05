import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Menu from '../models/menu.js';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS BY ALL USERS/GUESTS
export async function getAllOrders() {
	return await Order.find();
}

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS FOR THAT USER/ID
export async function getOrdersByUser(userId) {
	return await Order.find({ userId });
}

// ----------------------------------------------------------------------------------------

// (POST) - CREATES ORDER FOR CART(id) RECEIVED
export async function createOrderFromCart(cartId) {
	const cart = await Cart.findOne({ cartId });

	if (!cart) {
		const error = new Error('could not find cart');
		error.status = 404;
		throw error;
	}

	// Fetches all prodId from cart
	const prodIds = cart.products.map((item) => item.prodId);

	// Fetches correct products from the menu
	const menuItems = await Menu.find({ prodId: { $in: prodIds } });

	// Calculate total price based on "priceMap" & qty
	const priceMap = {};
	menuItems.forEach((menuItem) => {
		priceMap[menuItem.prodId] = menuItem.price;
	});

	// Calculate total price based on "priceMap" & qty
	const total = cart.products.reduce((sum, item) => {
		const price = priceMap[item.prodId] || 0;
		return sum + price * item.qty;
	}, 0);

	const newOrder = new Order({
		orderId: 'order-' + uuidv4().slice(0, 5),
		userId: cart.userId,
		cartId: cart.cartId,
		products: cart.products,
		total,
		// Vid POST-anrop måste man specifikt säga vad som ska finnas med i ordern.
		// Det finns redan en blueprint (Schema), men vid POST måste man ändå
		// säga till koden att "det här måste du faktiskt ha med".
	});

	await newOrder.save();

	return newOrder;
}
