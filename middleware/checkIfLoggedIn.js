// om inloggad måste man logga ut innan man kan skapa nytt konto igen
export function checkIfLoggedIn(req, res, next) {
    if(global.user) {
        next({
            status : 400,
            message : 'User already logged in'
        })
    }
    next();
};