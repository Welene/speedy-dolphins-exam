import { Router } from "express";
import { getAllOrders, getOrdersByUser, createOrderFromCart } from "../services/ordersServices.js";
import validateCartId from "../middleware/validateCartId.js";

const router = Router();

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS BY ALL USERS/GUESTS
router.get("/orders", async (req, res, next) => {
  try {
    const allOrders = await getAllOrders();
    res.status(200).json({
      success: true,
      message: "These are all the orders that exist:",
      data: allOrders,
    });
  } catch (error) {
    next({
      status: 500,
      message: "Failed fetching orders - server error.",
    });
  }
});

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS FOR THAT USER/ID
router.get("/orders/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const personalOrders = await getOrdersByUser(userId);

    if (!personalOrders.length) {
      return next({
        status: 404,
        message: "This user does not have any orders",
      });
    }

    res.status(200).json({
      success: true,
      message: "These are all the orders for this specific user",
      data: personalOrders,
    });
  } catch (error) {
    next({
      status: 500,
      message: "Failed fetching orders - server error.",
    });
  }
});

// ----------------------------------------------------------------------------------------

// (POST) - CREATES ORDER FOR CART(id) RECEIVED IN REQ.BODY (or guest order if not)
// ORDER IS SENT BACK TO THE USER IN THE RESPONSE

router.post("/orders", validateCartId, async (req, res, next) => {
  try {
    let { cartId } = req.body;

    const newOrder = await createOrderFromCart(cartId);

    res.status(201).json({
      success: true,
      message: "Order created!",
      data: newOrder,
      // order (newOrder) returns to user
    });
  } catch (error) {
    next({ status: 500, message: "Could not create order - server error" });
  }
});

export default router;
