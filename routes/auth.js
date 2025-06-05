import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { findUser, registerUser } from '../services/usersServices.js';
import { validateAuthBody } from '../middleware/validateAuthBody.js';
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn.js';

const router = Router();

// REGISTER
router.post('/register', checkIfLoggedIn, validateAuthBody, async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const result = await registerUser({
            username,
            password,
            userId: `user-${uuid().substring(0, 5)}`
        });
    
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: result.userId
        });
    } catch (error) {
        next(error);
    }
});

// LOGIN
router.post('/login', validateAuthBody, async (req, res, next) => {
    const { username, password } = req.body;

    const user = await findUser(username);

    if (user) {
        if (user.password === password) {
            global.user = user;
            return res.json({
                success: true,
                message: 'User logged in successfully'
            });
        } else {
            return next({
                status: 400,
                message: 'Username or password are incorrect'
            });
        }
    } else {
        return next({
            status: 400,
            message: 'Username or password are incorrect'
        });
    }
});

// LOGOUT
router.get('/logout', (req, res) => {
    global.user = null; 
    res.json({
        success : true,
        message : 'User logged out successfully'
    });
});

export default router;