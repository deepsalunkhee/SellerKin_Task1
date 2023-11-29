// Products.js

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import './Product.css'; // Import the CSS file

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your backend endpoint when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/list');
        if (response.ok) {
          const result = await response.json();
          setData(result.results || []); // Set the fetched data to the state variable
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <div className="card-container">
        {/* Map through 'data' and render a Card component for each listing */}
        {data.map((listing, index) => (
          <Cards key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default Products;
