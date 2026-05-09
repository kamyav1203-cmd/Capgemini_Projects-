import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Checkout() {
  const [form, setForm] = useState({ deliveryAddress: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/orders', form);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed.');
    }
  };

  return (
    <section className="narrow">
      <h1>Checkout</h1>
      <form className="card compact-card" onSubmit={placeOrder}>
        <label className="form-label">Delivery address
          <textarea className="form-control" rows="4" value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} required />
        </label>
        <label className="form-label">Phone number
          <input className="form-control" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
        </label>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-success" type="submit">Place order</button>
      </form>
    </section>
  );
}
