import React, { useState } from "react";

const productsData = [
  { id: 1, name: "React T-Shirt", price: 999 },
  { id: 2, name: "JavaScript Mug", price: 499 },
  { id: 3, name: "Laptop Sticker", price: 99 },

  // 🎁 FREE PRODUCTS
  { id: 4, name: "Kani Special Gift", price: 0 },
  { id: 5, name: "Pri Surprise Box", price: 0 },
];

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) return removeItem(id);

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={container}>
      <h2 style={title}>🛍️ Products</h2>

      {productsData.map((product) => (
        <div key={product.id} style={productCard}>
          <span>
            {product.name}{" "}
            <b>
              {product.price === 0 ? "FREE 🎁" : `₹${product.price}`}
            </b>
          </span>

          <button style={addBtn} onClick={() => addToCart(product)}>
            Add
          </button>
        </div>
      ))}

      <h2 style={title}>🛒 Cart</h2>

      {cart.length === 0 && (
        <p style={{ textAlign: "center" }}>No items yet</p>
      )}

      {cart.map((item) => (
        <div key={item.id} style={cartCard}>
          <div>
            <strong>{item.name}</strong>
            <p>
              {item.qty} ×{" "}
              {item.price === 0 ? "FREE" : `₹${item.price}`} ={" "}
              <b>
                {item.price === 0
                  ? "FREE 🎁"
                  : `₹${item.qty * item.price}`}
              </b>
            </p>
          </div>

          <div>
            <button
              onClick={() => updateQty(item.id, item.qty + 1)}
              style={btn}
            >
              +
            </button>

            <button
              onClick={() => updateQty(item.id, item.qty - 1)}
              style={{ ...btn, marginLeft: "5px" }}
            >
              -
            </button>

            <button
              onClick={() => removeItem(item.id)}
              style={{ ...removeBtn, marginLeft: "8px" }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <h3 style={totalBox}>
        Total: {total === 0 ? "FREE 🎉" : `₹${total}`}
      </h3>
    </div>
  );
}

/* 🎨 CLEAN STYLES */

const container = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "20px",
  background: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const title = {
  textAlign: "center",
  marginBottom: "15px",
};

const productCard = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  marginBottom: "10px",
  background: "#fff",
  borderRadius: "6px",
};

const cartCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginBottom: "10px",
  background: "#fff",
  borderRadius: "6px",
};

const btn = {
  padding: "5px 10px",
  border: "none",
  background: "#333",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
};

const addBtn = {
  padding: "6px 12px",
  border: "none",
  background: "#007bff",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
};

const removeBtn = {
  padding: "5px 10px",
  border: "none",
  background: "#dc3545",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
};

const totalBox = {
  textAlign: "center",
  marginTop: "20px",
  padding: "10px",
  background: "#e8f5e9",
  borderRadius: "6px",
  fontWeight: "bold",
};

export default ShoppingCart;