import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import './Product.css'; 

const Products = () => {
  const [data, setData] = useState([]);

  const sendRequestToEndpoint = useCallback(() => {
    fetch('seller-kin-task1-server.vercel.app/', {
      method: 'GET', 
    })
    .then(response => {
      if (response.ok) {
        console.log('Request sent successfully!');
      } else {
        console.error('Failed to send request.');
      }
    })
    .catch(error => {
      console.error('Error sending request:', error);
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('seller-kin-task1-server.vercel.app/list');
      if (response.ok) {
        const result = await response.json();
        setData(result.results || []); 
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data on initial render

    const intervalId = setInterval(sendRequestToEndpoint, 20 * 60 * 1000);

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, [fetchData, sendRequestToEndpoint]);

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
