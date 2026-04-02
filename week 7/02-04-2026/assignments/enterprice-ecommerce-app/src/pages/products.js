import { Link } from "react-router-dom";

function Products() {
  return (
    <div className="card">
      <h1>Products</h1>

      <Link className="btn" to="/products/1">Product 1</Link>
      <Link className="btn" to="/products/2">Product 2</Link>
    </div>
  );
}

export default Products;