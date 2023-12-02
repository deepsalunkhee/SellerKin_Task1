import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import './Product.css'; 
import Popup from '../pages/Popup';
import Snowfall from 'react-snowfall'


import Search from '../components/Search';


const Products = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
 
  const server = 'http://localhost:3000';
  //const server = 'https://seller-kin-task1-server.vercel.app';
  

  const sendRequestToEndpoint = useCallback(() => {
    fetch(`${server}/`, {
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
      console.error('Error sending request: to server', error);
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${server}/list`);
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
    //sendRequestToEndpoint(); // Send request to server on initial render
    fetchData(); // Fetch data on initial render

    

    
  }, [fetchData, sendRequestToEndpoint]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    []
  );

  useEffect(() => {
    const filteredResults = data.filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [data, searchQuery]);

  const openPopup = (listing) => {
    setSelectedListing(listing);
    setShowPopup(true);
    console.log(listing);
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='product-container' >
      <Snowfall className="snowfall"
        
        color='lightblue'
        snowflakeCount={100}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}

      />
      <Header />
      <Search handleSearch={handleSearch} />

      <div className="card-container">
        {filteredData.map((listing, index) => (
          <Cards key={index} listing={listing} openPopup={openPopup}   />
        ))}
      </div>
      {showPopup && <Popup selectedListing={selectedListing} closePopup={closePopup} />}
    </div>
  );
};

export default Products;