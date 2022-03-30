import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Detail from "./Detail";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";

export default function App() {
  // function inside useState is used for lazy binding. So the function only runs once when the component is rendered.
  // if we assing the value directly then it will fetch the data from localstorage in every rerender.
  // That will be expensive and causes performance issue.
  const [cart, setCart] = useState(() => {
    try {
      // localstorage
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      console.error("Cart data couldn't be parsed into JSON!");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id, sku) => {
    // As we are updating state from the existing state, we are using 'Function form' of set Sate.
    // It takes the previous state as argument and what ever value is returned that will be set as current state.
    setCart((items) => {
      const itemInCart = items.find((item) => item.sku === sku);
      // itemInCart.quantity++; // DON'T DO THIS
      if (itemInCart) {
        // return new array with the matching item replaced
        return items.map((item) =>
          item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // return new array with the new item appended
        return [...items, { id, sku, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (sku, quantity) => {
    setCart((items) => {
      return quantity === 0
        ? items.filter((item) => item.sku !== sku) // filter accepts a predicate (function) which returns true or false
        : items.map((item) =>
            item.sku === sku ? { ...item, quantity } : item
          );
    });
  };
  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />
            <Route path="/:category" element={<Products />} />{" "}
            {/* Named placeholder -> these can be received from the respective component using useParams Hook from react-router-dom by destructuring it */}
            <Route
              path="/:category/:id"
              element={<Detail addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} updateQuantity={updateQuantity} />}
            />
            <Route path="/checkout" element={<Checkout cart={cart} />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

/**
 * Update Immutable friendly way -> array.map
 * Remove Immutable friendly way -> array.filter
 */
