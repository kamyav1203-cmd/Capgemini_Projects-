import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyFood = { name: '', description: '', price: '', imageUrl: '', categoryId: '', isAvailable: true };

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [category, setCategory] = useState({ name: '', description: '' });
  const [food, setFood] = useState(emptyFood);

  const load = async () => {
    const [catRes, foodRes, orderRes] = await Promise.all([api.get('/food/categories'), api.get('/food'), api.get('/orders')]);
    setCategories(catRes.data);
    setFoods(foodRes.data);
    setOrders(orderRes.data);
  };
  useEffect(() => { load(); }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    await api.post('/food/categories', category);
    setCategory({ name: '', description: '' });
    load();
  };

  const saveFood = async (event) => {
    event.preventDefault();
    await api.post('/food', { ...food, price: Number(food.price), categoryId: Number(food.categoryId) });
    setFood(emptyFood);
    load();
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/food/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setFood((current) => ({ ...current, imageUrl: data.imageUrl }));
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status: Number(status) });
    load();
  };

  const deleteFood = async (id) => {
    await api.delete(`/food/${id}`);
    load();
  };

  return (
    <section>
      <h1>Admin dashboard</h1>
      <div className="admin-grid">
        <form className="card compact-card" onSubmit={saveCategory}>
          <h2>Category</h2>
          <input className="form-control" placeholder="Name" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} required />
          <input className="form-control" placeholder="Description" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} />
          <button className="btn btn-primary">Add category</button>
        </form>
        <form className="card compact-card" onSubmit={saveFood}>
          <h2>Food item</h2>
          <input className="form-control" placeholder="Name" value={food.name} onChange={(e) => setFood({ ...food, name: e.target.value })} required />
          <textarea className="form-control" placeholder="Description" value={food.description} onChange={(e) => setFood({ ...food, description: e.target.value })} required />
          <input className="form-control" type="number" placeholder="Price" value={food.price} onChange={(e) => setFood({ ...food, price: e.target.value })} required />
          <input className="form-control" placeholder="Image URL" value={food.imageUrl} onChange={(e) => setFood({ ...food, imageUrl: e.target.value })} />
          <input className="form-control" type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} />
          <select className="form-select" value={food.categoryId} onChange={(e) => setFood({ ...food, categoryId: e.target.value })} required>
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn btn-primary">Add food</button>
        </form>
      </div>
      <h2 className="section-title">Food items</h2>
      <div className="table-responsive">
        <table className="table"><tbody>{foods.map((f) => <tr key={f.id}><td>{f.name}</td><td>₹{f.price}</td><td>{f.categoryName}</td><td><button className="btn btn-outline-danger btn-sm" onClick={() => deleteFood(f.id)}>Delete</button></td></tr>)}</tbody></table>
      </div>
      <h2 className="section-title">Orders</h2>
      <div className="table-responsive">
        <table className="table">
          <thead><tr><th>Order</th><th>Total</th><th>Status</th><th>Address</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select className="form-select" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    <option value="0">Pending</option>
                    <option value="1">Preparing</option>
                    <option value="2">Delivered</option>
                  </select>
                </td>
                <td>{o.deliveryAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
