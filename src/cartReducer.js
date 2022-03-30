/**
 * Whatever we return from the reducer that will become the new state
 */

export default function cartReducer(cart, action) {
  switch (action.type) {
    case "empty":
      return [];
    case "updateQuantity": {
      const { quantity, sku } = action;
      return quantity === 0
        ? cart.filter((item) => item.sku !== sku)
        : cart.map((item) => (item.sku === sku ? { ...item, quantity } : item));
    }
    case "add":
      const { id, sku } = action;
      const itemInCart = cart.find((item) => item.sku === sku);
      // itemInCart.quantity++; // DON'T DO THIS
      if (itemInCart) {
        // return new array with the matching item replaced
        return cart.map((item) =>
          item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // return new array with the new item appended
        return [...cart, { id, sku, quantity: 1 }];
      }
    default:
      throw new Error("Unhandled action " + action.type);
  }
}
