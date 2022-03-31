import React, { useReducer, useEffect, useContext } from "react";
import CartReducer from "./cartReducer";

export const CartContext = React.createContext(null);

let initialCart;
try {
  // localstorage
  initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
} catch {
  console.error("Cart data couldn't be parsed into JSON!");
  initialCart = [];
}

export function CartProvider(props) {
  const [cart, dispatch] = useReducer(CartReducer, initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const contextValue = {
    cart,
    dispatch,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider. Wrap a parent component in <CartProvider> to fix this error!"
    );
  }
  return context;
}
