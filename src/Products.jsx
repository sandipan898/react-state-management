import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import useFetch from "./services/useFetch";
import Spinner from "./Spinner";

export default function Products() {
  const [size, setSize] = useState("");
  const { category } = useParams();
  /*
  // same as above
  const state = useState("");
  const size = state[0];
  const setSize = state[1];
  */

  const {
    data: products, // using alias for the data returned
    error,
    loading,
  } = useFetch(`products?category=${category}`);

  /*
  useEffect(() => {
    // promise based call
    // getProducts("shoes")
    // .then(response => setProducts(response))
    // .catch(e => setError(e))
    // .finally(() => setLoading(false));

    // async-await basde call -> these are syntactic sugar on the promise based calls
    const init = async () => {
      try {
        const response = await getProducts("shoes");
        setProducts(response);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  */

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        <Link to={`/${category}/${p.id}`}>
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </Link>
      </div>
    );
  }

  // Implementing derived state
  const filteredProducts = size
    ? products.filter((product) =>
        product.skus.find((s) => s.size === parseInt(size))
      )
    : products;

  if (error) throw error;
  if (loading) return <Spinner />;
  if (products.length === 0) return <PageNotFound />;

  return (
    <>
      <section id="filters">
        <label htmlFor="size">Filter by Size:</label>{" "}
        <select
          id="size"
          value={size}
          onChange={(e) => {
            // debugger;
            setSize(e.target.value);
          }}
        >
          <option value="">All sizes</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        {size && <h2>{filteredProducts.length} items found.</h2>}
      </section>
      <section id="products">{filteredProducts.map(renderProduct)}</section>
    </>
  );
}
