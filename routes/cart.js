import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getAllCarts, getCartById, updateCart } from "../services/cartServices.js";
import validateCartInput from "../middleware/validateCartInput.js";
import { validateProdId } from "../middleware/validateProdId.js";

const router = Router();

// GET all carts (admin)
router.get("/", async (req, res, next) => {
  // Kolla om user är admin
  //   if (!global.user || global.user.role !== "admin") {
  //     return res.status(403).json({ message: "Not authorized" });
  //   }

  const carts = await getAllCarts(); //hämtar alla carts
  if (carts && carts.length > 0) {
    res.json({
      success: true,
      carts: carts,
    });
  } else {
    next({ status: 404, message: "No carts were found" });
  }
});

// GET cart by cartId
router.get("/:cartId", async (req, res, next) => {
  const { cartId } = req.params;
  const cart = await getCartById(cartId);
  if (cart) {
    res.json({
      success: true,
      cart: cart,
    });
  } else {
    next({ status: 404, message: "No cart found" });
  }
});

// PUT update cart
router.put("/", validateCartInput, validateProdId, async (req, res, next) => {
  // Hämta userId från global.user om någon är inloggad
  const userId = global.user ? global.user.userId : null;
  // Plocka ut cartId och guestId (om de finns) samt prodId och qty
  const { prodId, qty, cartId, guestId } = req.body;

  try {
    // Skicka alla id:n vidare till service-funktionen
    const cart = await updateCart({ cartId, userId, guestId, prodId, qty });
    res.json({ success: true, cart });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
});

export default router;
