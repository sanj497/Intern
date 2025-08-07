// src/components/FavoritesButton.jsx
import React from 'react';
import axios from 'axios';

const FavoritesButton = ({ userId, productId }) => {
  const handleAddToFavorites = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/Favorites/add/',{
        userId,
        productId,
      });
      alert('Added to favorites successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites.');
    }
  };

  return (
    <button onClick={handleAddToFavorites} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
      Add to Favorites ❤️
    </button>
  );
};

export default FavoritesButton;
