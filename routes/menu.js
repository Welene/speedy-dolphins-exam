import { Router } from 'express';
import Menu from '../models/menu.js';

const router = Router();

router.get('/menu', async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json({
			success: true,
			message: 'This is the menu:',
			data: menu,
		});
	} catch (error) {
		next({
			status: 500,
			message: 'Failed to fetch menu - server error.',
		});
	}
});

export default router;
