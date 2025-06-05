export default function validateCartId(req, res, next) {
  if (!req.body.cartId) {
    return res.status(400).json({
      success: false,
      message: "cartId is required",
    });
  }
  next();
}
