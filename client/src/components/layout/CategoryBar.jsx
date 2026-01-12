import React from 'react';
import '../../styles/CategoryBar.css';

const CategoryBar = ({ activeCategory, onCategoryChange }) => {
  const categories = ["All", "Signature", "Essentials", "Limited"];

  return (
    <div className="category-bar-container">
      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-item ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;