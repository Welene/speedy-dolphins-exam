import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const menuSchema = new Schema(
	{
		prodId: {
			type: String,
			unique: true,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: 'menu',
		// mongoose looks for plural words (ex. "menus") in the database & the collection is called "menu" in singular
		// "collection": 'menu' forces mongoose to look for that singular word in the database & not a plural word
	}
);

const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema);

export default Menu;
