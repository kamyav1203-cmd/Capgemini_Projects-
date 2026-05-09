import { useEffect, useState } from 'react';
import api from '../api/client';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/my').then((r) => setOrders(r.data)); }, []);

  return (
    <section>
      <h1>Order history</h1>
      <div className="order-list">
        {orders.map((order) => (
          <article className="card compact-card" key={order.id}>
            <div className="d-flex justify-content-between">
              <strong>Order #{order.id}</strong>
              <span className="badge text-bg-warning">{order.status}</span>
            </div>
            <p className="text-secondary mb-2">{new Date(order.createdAtUtc).toLocaleString()}</p>
            {order.items.map((item) => <div key={item.foodItemId}>{item.foodName} x {item.quantity}</div>)}
            <div className="d-flex justify-content-between mt-3">
              <strong>₹{order.totalAmount}</strong>
              <a className="btn btn-outline-primary btn-sm" href={`${import.meta.env.VITE_API_URL || 'https://localhost:5001/api'}/orders/${order.id}/invoice`} target="_blank" rel="noreferrer">Invoice</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
