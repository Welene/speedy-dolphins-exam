import Menu from "../models/menu.js";

export async function validateProdId(req, res, next) {
  const { prodId } = req.body;
  const menuItem = await Menu.findOne({ prodId });
  if (!menuItem) {
    return res.status(400).json({ success: false, message: "prodId is not in the menu" });
  }
  next();
}
