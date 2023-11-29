import React, { useEffect, useState } from 'react';
import './Cards.css'; // Import the CSS file

const Card = ({ listing }) => {
  const [images, setImages] = useState([]);
  const[revenue,setRevenue]=useState([]);

  // Function to truncate text if it exceeds a certain length
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...'; // Truncate text and add ellipsis
    }
    return text;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/images?id=${listing.listing_id}`);
        if (response.ok) {
          const result = await response.json();
          setImages(result.results || []); // Set the fetched data to the state variable
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
        const response = await fetch(`http://localhost:3000/economic?id=${listing.listing_id}`);
        if (response.ok) {
          const result = await response.json();
          setRevenue(result.results || []); // Set the fetched data to the state variable
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
    <div className="card">
      {images.length > 0 && (
        <img src={images[0].url_170x135} alt={listing.title} />
      )}
      <h3>{truncateText(listing.title, 30)}</h3> {/* Limit the name to 30 characters */}
      <p>Description: {truncateText(listing.description, 100)}</p> {/* Limit the description to 100 characters */}
      <p>Sales:XXXXXX</p>
      <p>Revenue:XXXXXXXXX</p>
    </div>
  );
};

export default Card;
