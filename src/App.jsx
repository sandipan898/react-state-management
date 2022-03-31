import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cart from "./Cart";
// import Checkout from "./Checkout";
import Checkout from "./Checkout.class";
// import Detail from "./DetailRefs";
// import Detail from "./Detail";
import Detail from "./Detail.class";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { useCart } from "./cartContext";

export default function App() {
  /*
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
  */

  /*
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

  const emptyCart = () => {
    setCart([]);
  };
  */

  const { dispatch } = useCart();

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />
            <Route path="/:category" element={<Products />} />{" "}
            {/* Named placeholder -> these can be received from the respective component using useParams Hook from react-router-dom by destructuring it */}
            <Route path="/:category/:id" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout dispatch={dispatch} />} />
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
