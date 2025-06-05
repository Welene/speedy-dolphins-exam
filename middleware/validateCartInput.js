export default function validateCartInput(req, res, next) {
  const { prodId, qty } = req.body;
  if (!prodId || qty === undefined) {
    return res.status(400).json({ success: false, message: "prodId and qty is required" });
  }
  next();
}
