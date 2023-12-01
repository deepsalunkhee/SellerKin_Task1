import React, { useEffect, useState } from 'react';
import './Cards.css'; 

const Card = ({ listing }) => {
  const [images, setImages] = useState([]);
  const[revenue,setRevenue]=useState([]);

  
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...'; 
    }
    return text;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/images?id=${listing.listing_id}`);
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
        const response = await fetch(`http://localhost:3000/economic?id=${listing.listing_id}`);
        if (response.ok) {
          const result = await response.json();
          setRevenue(result || []);
           console.log(revenue.price.amount);
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
      <h3>{truncateText(listing.title, 30)}</h3>
      <p>Description: {truncateText(listing.description, 100)}</p> 
      <p>Sales:{Math.ceil(revenue.views*0.0399 +  revenue.num_favorers*0.175)}</p>
    </div>
  );
};

export default Card;
