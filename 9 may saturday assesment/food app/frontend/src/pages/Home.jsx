import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', categoryId: '', maxPrice: '' });
  const [notice, setNotice] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => { api.get('/food/categories').then((r) => setCategories(r.data)); }, []);
  useEffect(() => {
    api.get('/food', { params: { ...filters, categoryId: filters.categoryId || undefined, maxPrice: filters.maxPrice || undefined } })
      .then((r) => setFoods(r.data));
  }, [filters]);

  const addToCart = async (foodItemId) => {
    if (!isAuthenticated) {
      setNotice('Please login to add items to cart.');
      return;
    }
    await api.post('/cart', { foodItemId, quantity: 1 });
    setNotice('Added to cart.');
  };

  return (
    <section>
      <div className="toolbar">
        <div>
          <h1>Order food online</h1>
          <p className="text-secondary mb-0">Browse meals, filter by category or budget, and checkout securely.</p>
        </div>
        <div className="filters">
          <input className="form-control" placeholder="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="form-select" value={filters.categoryId} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="form-control" type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
      </div>
      {notice && <div className="alert alert-success">{notice}</div>}
      <div className="food-grid">
        {foods.map((food) => (
          <article className="card food-card" key={food.id}>
            <img src={food.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'} alt={food.name} />
            <div className="card-body">
              <div className="d-flex justify-content-between gap-2">
                <h2>{food.name}</h2>
                <strong>₹{food.price}</strong>
              </div>
              <p>{food.description}</p>
              <span className="badge text-bg-light">{food.categoryName}</span>
              <div className="d-flex gap-2 mt-3">
                <Link className="btn btn-outline-primary flex-fill" to={`/food/${food.id}`}>Details</Link>
                <button className="btn btn-success flex-fill" onClick={() => addToCart(food.id)}>Add</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
