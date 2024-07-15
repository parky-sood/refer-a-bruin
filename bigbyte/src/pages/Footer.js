import React from 'react';
import '../Styling/Footer.css';
// Creating a footer to have for contact the developers 
const Footer = () => {
  return (
    <footer className="footer" style={{width: "100vw", position: "absolute", left: "0"}}>
      <div className="footer-content">
        {/* Title */}
        <div className="footer-title">#Refer a Bruin</div>
        {/* UCLA Logo  */}
        <img src="https://1000logos.net/wp-content/uploads/2017/11/UCLA-Logo.png" alt="Logo" className="footer-logo" />
        <div className="footer-contact">
          {/* Connect with email; email is being displayed as support gmail but it is just my email */}
          <h4 className="footer-contact" >Connect With Us! </h4>
          <div className="email-container">
             {/* Change the subject so that way I can know what its a Refer a Bruin Subject */}
            <img src="https://imaginethatcreative.net/blog/wp-content/uploads/2023/06/2250206.png" alt="Email Icon" className="email-icon" />
            <a href="mailto:nnunezsa@g.ucla.edu?subject=Refer%20A%20Bruin:">support@bigbytes.com</a>
          </div>
        </div>
      </div>
      <hr className="footer-divider" />
      {/* Created a fake company logo at the bottom so it can look a little more realistic */}
      <p className="footer-info">Big Bytes@2024</p>
    </footer>
  );
}

export default Footer;
