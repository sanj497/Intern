import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Product() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [toast, setToast] = useState("");
  const [rawSample, setRawSample] = useState(null); 
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:5000/api/product/")
      .then(res => {
        const data = res.data.data;
        setProducts(data);
        // Show raw first product in console so you can see field names
        if (data && data.length > 0) {
          console.log("RAW PRODUCT FIELDS:", Object.keys(data[0]));
          console.log("RAW PRODUCT DATA:", data[0]);
          setRawSample(data[0]);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Helper: get field value regardless of capitalisation
  const f = (product, lower, upper) =>
    product[lower] !== undefined ? product[lower] : product[upper];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const saveCartToDB = async (newCart) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/cart/save",
        { items: newCart.map(i => ({ productId: i._id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) { /* silent */ }
  };

  const addToCart = (product) => {
    const name = f(product, "productName", "ProductName");
    const price = f(product, "price", "Price");
    const thumb = f(product, "thumbnail", "Thumbnail");

    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      showToast("Quantity updated in cart!");
    } else {
      newCart = [...cart, {
        _id: product._id,
        productName: name,
        price: price,
        thumbnail: thumb,
        quantity: 1
      }];
      showToast("✅ Added to cart!");
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
    saveCartToDB(newCart);
  };

  const addToFavorites = async (productId) => {
    if (!userId) { alert("Please login to save favorites!"); navigate("/login"); return; }
    try {
      await axios.post("http://localhost:5000/api/favorites/add", { userId, productId });
      showToast("❤️ Added to favorites!");
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Already in favorites"));
    }
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: 'Segoe UI', sans-serif; background: linear-gradient(to right, #f8f9fa, #e0f7fa); }
        .product-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .product-title { text-align: center; font-size: 2rem; font-weight: 600; margin-bottom: 2rem; color: #333; }
        .product-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2rem; }
        .product-card { background: white; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.12); }
        .product-card img { width: 100%; height: 220px; object-fit: cover; border-bottom: 1px solid #eee; display: block; }
        .product-info { padding: 1rem; text-align: center; }
        .product-info h3 { font-size: 1.1rem; color: #222; margin: 0.5rem 0; font-weight: 600; }
        .product-info .description { font-size: 0.85rem; color: #666; margin: 0.4rem 0 0.6rem; height: 45px; overflow: hidden; }
        .price { font-size: 1.05rem; color: #e91e63; font-weight: 700; margin-bottom: 0.4rem; }
        .stock-badge { display: inline-block; padding: 0.2rem 0.7rem; font-size: 0.8rem; border-radius: 20px; margin-bottom: 0.8rem; }
        .in-stock { background: #e0f2f1; color: #00796b; }
        .out-of-stock { background: #ffebee; color: #b71c1c; }
        .btn-row { display: flex; gap: 0.5rem; justify-content: center; }
        .cart-btn { background: #d96fa6; color: #fff; border: none; padding: 8px 14px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
        .cart-btn:disabled { background: #ccc; cursor: not-allowed; }
        .fav-btn { background: #fff0f6; color: #e91e63; border: 1px solid #f8bbd0; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; }
        .debug-box { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.82rem; font-family: monospace; word-break: break-all; }
      `}</style>

      <Navbar activePage="product" />

      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, background: "#333", color: "#fff", padding: "12px 20px", borderRadius: 12, zIndex: 1000, fontWeight: 500, fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <div className="product-page">
        <div className="product-title">Our Handmade Crochet Collection</div>

        

        <div className="product-container">
          {products.map((p) => {
            // Support both lowercase and uppercase field names from DB
            const name  = f(p, "productName",  "ProductName");
            const price = f(p, "price",        "Price");
            const stock = f(p, "stock",        "Stock");
            const thumb = f(p, "thumbnail",    "Thumbnail");
            const desc  = f(p, "description",  "Description");
            const inStock = stock != null && Number(stock) > 0;

            return (
              <div className="product-card" key={p._id}>
                <img
                  src={thumb}
                  alt={name}
                  onError={e => { e.target.src = "https://placehold.co/260x220?text=No+Image"; }}
                />
                <div className="product-info">
                  <h3>{name}</h3>
                  <p className="description">{desc}</p>
                  <p className="price">Rs. {price}</p>
                  <span className={`stock-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
                    {inStock ? `In Stock (${stock})` : "Out of Stock"}
                  </span>
                  <br />
                  <div className="btn-row">
                    <button
                      className="cart-btn"
                      disabled={!inStock}
                      onClick={() => addToCart(p)}
                    >
                      🛒 Add to Cart
                    </button>
                    <button className="fav-btn" onClick={() => addToFavorites(p._id)}>❤️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ backgroundColor: "#2d2d2d", color: "#ccc", textAlign: "center", padding: "2rem", marginTop: "3rem" }}>
        <p style={{ fontSize: "0.9rem" }}>© 2025 granny_SB. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Product;
