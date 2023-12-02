import React from 'react';
import './Popup.css'; // Import the CSS file for Popup component

const Popup = ({ selectedListing, closePopup }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closePopup}>
          &times;
        </span>
        <h2>{selectedListing.title}</h2>
        {/* Display other details from the selected listing */}
        <p>We can display any specific info that we would like to</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default Popup;
