import React from 'react';
import './Popup.css'; 

const Popup = ({ selectedListing, closePopup }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closePopup}>
          &times;
        </span>
        <h2>{selectedListing.title}</h2>
       
        <p>We can display any specific info that we would like to</p>
        
      </div>
    </div>
  );
};

export default Popup;
