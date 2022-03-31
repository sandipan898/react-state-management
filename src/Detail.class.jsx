import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fetch } from "./services/useFetch";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
import { CartContext } from "./cartContext";

/**
 * Consuming context: method 1: Passing data/methods via props from parent component
 * Consuming context: method 2: Custom wrapper
 * Consuming context: method 3: render props
 * Consuming context: method 4: children props
 */

/**
 * Using custom wrapper class so that we can consume the hooks and pass the values to the
 * class and use it there.
 */

export default function DetailWrapper() {
  // const { dispatch } = useCart();
  const { id } = useParams();
  // const fetchResponse = useFetch(`products/${id}`);

  return (
    <Detail
      id={id}
      //   fetchResponse={fetchResponse}
      navigate={useNavigate()}
      //   dispatch={dispatch}
    />
  );
}

class Detail extends React.Component {
  state = {
    sku: "",
  };

  /*
  // this will connect our class component to the cart context
  // it will expose the context under this.context
  // downside: this will allow us consume only one context per class
  static contextType = CartContext;
  */

  render() {
    const { id, navigate } = this.props;
    // const { data: product, error, loading } = fetchResponse;
    const { sku } = this.state;

    return (
      // Consuming multiple contexts
      <CartContext.Consumer>
        {({ dispatch }) => {
          return (
            <Fetch url={`products/${id}`}>
              {(product, loading, error) => {
                if (loading) return <Spinner />;
                if (!product) return <PageNotFound />;
                if (error) throw error;

                return (
                  <div id="detail">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p id="price">${product.price}</p>
                    <select
                      id="size"
                      value={sku}
                      onChange={(e) => {
                        this.setState({ sku: e.target.value });
                      }}
                    >
                      <option value="">Select size</option>
                      {product.skus &&
                        product.skus.map((sku) => (
                          <option key={sku.sku} value={sku.sku}>
                            {sku.size}
                          </option>
                        ))}
                    </select>
                    <p>
                      <button
                        disabled={!sku}
                        className="btn btn-primary"
                        onClick={() => {
                          dispatch({ type: "add", id, sku });
                          navigate("/cart");
                        }}
                      >
                        Add to cart
                      </button>
                    </p>
                    <img
                      src={`/images/${product.image}`}
                      alt={product.category}
                    />
                  </div>
                );
              }}
            </Fetch>
          );
        }}
      </CartContext.Consumer>
    );
  }
}
