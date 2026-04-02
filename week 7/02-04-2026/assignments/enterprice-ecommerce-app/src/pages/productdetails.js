import { useParams, Link, Outlet } from "react-router-dom";

function ProductDetails() {
  const { productId } = useParams();

  return (
    <div className="card">
      <h1>Product {productId}</h1>

      <Link className="btn" to="reviews">Reviews</Link>
      <Link className="btn" to="specs">Specs</Link>

      <Outlet />
    </div>
  );
}

export default ProductDetails;