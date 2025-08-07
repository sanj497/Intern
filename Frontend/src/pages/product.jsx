import React, { useEffect, useState } from "react";
import axios from "axios";

function Product() {
  const [products, setProducts] = useState([]);

  const userId = "6875c00b373cb4c158b82619"

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/product/")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // Function to add product to favorites
  const handleAddToFavorites = async (productId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/Favorites/add/",{
        userId,
        productId,
      });
      alert("✅ Added to favorites!");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add to favorites:", error.response || error);
      alert("❌ Failed to add to favorites.");
    }
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(to right, #f8f9fa, #e0f7fa);
          }

          .header {
            background-color: #ffb6c1;
            padding: 1.5rem 2rem;
            text-align: center;
            color: #3b3b3b;
            font-size: 2.5rem;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: 'Brush Script MT', cursive;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .product-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }

          .product-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: #333;
          }

          .product-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 2rem;
          }

          .product-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
          }

          .product-card img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-bottom: 1px solid #eee;
          }

          .product-info {
            padding: 1rem;
            text-align: center;
          }

          .product-info h3 {
            font-size: 1.2rem;
            color: #222;
            margin: 0.5rem 0;
            font-weight: 600;
          }

          .product-info .description {
            font-size: 0.9rem;
            color: #666;
            margin: 0.5rem 0 1rem;
            height: 50px;
            overflow: hidden;
          }

          .product-info .price {
            font-size: 1rem;
            color: #e91e63;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }

          .product-info .stock {
            display: inline-block;
            background: #e0f2f1;
            color: #00796b;
            padding: 0.2rem 0.6rem;
            font-size: 0.8rem;
            border-radius: 20px;
            margin-bottom: 0.5rem;
          }

          .favorite-button {
            background-color: #e91e63;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s;
          }

          .favorite-button:hover {
            background-color: #c2185b;
          }
        `}
      </style>

      <div className="header">🧵 granny_SB</div>

      <div className="product-page">
        <div className="product-title">Our Handmade Crochet Collection</div>

        <div className="product-container">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.Thumbnail || product.thumbnail}
                alt={product.ProductName || product.productName}
              />
              <div className="product-info">
                <h3>{product.ProductName || product.productName}</h3>
                <p className="description">{product.Description || product.description}</p>
                <p className="price">Rs. {product.Price || product.price}</p>
                <span className="stock">Stock: {product.Stock || product.stock}</span>
                <br />
                <button
                  className="favorite-button"
                  onClick={() => handleAddToFavorites(product._id)}
                >
                  Add to Favorites 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Product;
