import React from 'react';
import './Search.css';

const Search = ({ handleSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        className='search-input'
      />
    </div>
  );
};

export default Search;
