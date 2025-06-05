import Cart from "../models/cart.js";
import { v4 as uuid } from "uuid";
import Menu from "../models/menu.js";

//Hämta alla carts (admin)
export async function getAllCarts() {
  try {
    const carts = await Cart.find();
    return carts;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

//Hämta cart med cartId
export async function getCartById(cartId) {
  try {
    const cart = await Cart.find({ cartId: cartId });
    if (cart.length < 1) {
      throw new Error("No cart found");
    } else {
      return cart;
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

//Uppdatera cart

// Hjälpfunktion som hittar en befintlig cart eller skapar en ny om ingen finns
async function findOrCreateCart({ cartId, guestId, userId }) {
  let cart = null;

  // Leta först på cartId (om du redan har en aktiv cart)
  if (cartId) {
    cart = await Cart.findOne({ cartId });
  }
  //Om inget cartId finns, och användaren är inloggad – leta på userId
  else if (userId) {
    cart = await Cart.findOne({ userId });
  }
  // Om inget cartId eller userId finns, kolla efter guestId
  else if (guestId) {
    cart = await Cart.findOne({ guestId });
  }

  // Om ingen cart hittats än, så skapas en ny
  if (!cart) {
    cart = new Cart({
      // Skapa nytt cartId om inget finns (alltid "cart-xxxxx")
      cartId: cartId || "cart-" + uuid().slice(0, 5),
      // Koppla carten till userId om användaren är inloggad, annars null
      userId: userId || null,
      // Koppla carten till guestId om användaren inte är inloggad
      guestId: guestId || (!userId ? "guest-" + uuid().slice(0, 5) : null),
      products: [],
    });
    await cart.save(); // Spara i databasen direkt
  }

  return cart;
}

// Servicefunktion för att uppdatera cartens innehåll (lägga till, uppdatera, ta bort produkt)
export async function updateCart({ cartId, userId, guestId, prodId, qty }) {
  //Kollar så att produkt id:t finns i menyn
  // const menuItem = await Menu.findOne({ prodId });
  // if (!menuItem) {
  //   throw new Error("You can only add items from the menu!");
  // }
  // Hitta eller skapa carten först
  let cart = await findOrCreateCart({ cartId, guestId, userId });

  // Hitta om produkten redan finns i cartens produktlista
  const index = cart.products.findIndex((p) => p.prodId === prodId);
  //findIndex letar efter en produkt i listan där prodId matchar den produkt man vill lägga till/uppdatera/ta bort.
  //findIndex() letar efter det första elementet i en array som uppfyller villkoret i din funktion.
  //Om den INTE hittar någon match: returnerar den -1.

  // Om qty är 0, ta bort produkten ur varukorgen
  if (qty === 0) {
    if (index !== -1) cart.products.splice(index, 1);
    //kollar ifall produkten finns(index inte = -1, isf splicear vi index, 1 alltså där i index produkten finns)
  }
  // Om produkten inte finns, lägg till den med rätt qty
  else if (index === -1) {
    cart.products.push({ prodId, qty });
  }
  // Om produkten redan finns, uppdatera antal (qty)
  else {
    cart.products[index].qty = qty;
    //hämtar rätt produkt i products-arrayen med hjälp av index(matchningen från högre upp) och uppdaterar qty.
  }

  // Spara ändringarna i databasen
  await cart.save();
  // Returnera den uppdaterade carten
  return cart;
}
