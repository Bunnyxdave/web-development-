import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} STOCK-SIGHT. All Rights Reserved.</p>
      <p className="footer-credit">Built & Programmed by Burhan, Junaid, Abdurrahman.</p>
      <div className="footer-links">
        <a href="#">Privacy</a> | 
        <a href="#">Terms</a> | 
        <a href="#">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
