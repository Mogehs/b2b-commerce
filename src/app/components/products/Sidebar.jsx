import React from 'react';

const Sidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="w-full md:w-[220px] bg-white rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4 text-center md:text-left text-[#C9AF2F]">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-4 py-2 rounded transition uppercase hover:cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C9AF2F] text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
