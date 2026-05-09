import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { api.get(`/food/${id}`).then((r) => setFood(r.data)); }, [id]);
  if (!food) return <div className="container">Loading...</div>;

  const addToCart = async () => {
    await api.post('/cart', { foodItemId: food.id, quantity: 1 });
    setMessage('Added to cart.');
  };

  return (
    <section className="details-layout">
      <img src={food.imageUrl} alt={food.name} />
      <div>
        <span className="badge text-bg-light">{food.categoryName}</span>
        <h1>{food.name}</h1>
        <p className="lead">{food.description}</p>
        <h2>₹{food.price}</h2>
        {message && <div className="alert alert-success">{message}</div>}
        <button className="btn btn-success" onClick={addToCart}>Add to cart</button>
      </div>
    </section>
  );
}
