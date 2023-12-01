import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import './Product.css'; 

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/list');
        if (response.ok) {
          const result = await response.json();
          setData(result.results || []); 
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
        {data.map((listing, index) => (
          <Cards key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default Products;