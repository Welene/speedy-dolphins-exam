export function validateAuthBody(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return next({
            status: 400,
            message: "Both username and password are required"
        });
    }

    next();
};