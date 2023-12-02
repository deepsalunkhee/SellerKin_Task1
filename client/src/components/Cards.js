import React, { useEffect, useState } from 'react';
import './Cards.css'; 

const Card = ({ listing, openPopup }) => {
  const [images, setImages] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const server = 'https://seller-kin-task1-server.vercel.app';
  //const server = 'http://localhost:3000';

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/images?id=${listing.listing_id}`);
        if (response.ok) {
          const result = await response.json();
          setImages(result.results || []);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [listing.listing_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/economic?id=${listing.listing_id}`);
        
        if (response.ok) {
          const result = await response.json();
          setRevenue(result || []);

        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [listing.listing_id]);

  return (
    <div className="card" onClick={() => openPopup(listing)}>
      {images.length > 0 && (
        <img src={images[0].url_170x135} alt={listing.title} />
      )}
      <h3>{truncateText(listing.title, 30)}</h3>
      <p>Description: {truncateText(listing.description, 100)}</p>
      <p>Sales: {Math.ceil(revenue.views * 0.0399 + revenue.num_favorers * 0.175)}</p>
    </div>
  );
};

export default Card;
