import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const load = () => api.get('/cart').then((r) => setCart(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity: Number(quantity) });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/cart/${id}`);
    load();
  };

  return (
    <section>
      <h1>Your cart</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td>{item.foodName}</td>
                <td><input className="form-control qty-input" type="number" min="1" value={item.quantity} onChange={(e) => update(item.id, e.target.value)} /></td>
                <td>₹{item.unitPrice}</td>
                <td>₹{item.lineTotal}</td>
                <td><button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cart-total">
        <strong>Total: ₹{cart.total}</strong>
        <Link className={`btn btn-success ${cart.items.length === 0 ? 'disabled' : ''}`} to="/checkout">Checkout</Link>
      </div>
    </section>
  );
}
