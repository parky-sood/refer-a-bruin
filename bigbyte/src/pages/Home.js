import React from 'react';
import '../Styling/Home.css';
import { Link } from "react-router-dom";
import NavBar from './VisitNavBar';

import Footer from './Footer';


function Home() {
  return (
    <>
      <NavBar />
      <MainContent />
      <Footer />
    </>
  )
} export default Home;

function MainContent() {
  return (
    <div>
      {/* Beginning of Header: this is for me to know the difference so I can create the learn more button */}
      {/* Creating the header which will contain title of the name and the information of the app*/}
      <header className="container">
        <div className="background-layer"></div>
        <div className="content">
          <div className="left-side">
            <h1 className="text-in-container, h1">Refer a Bruin.</h1>
            <p className="text-in-container, p">An app that provides opportunities to all Bruins in search of internships.</p>
          </div>
          <div className="right-side">
            <Link to="/SignUp">
              {/* Allows users to create an account from interacting with the main page */}
              <button className="custom-button text-in-container">Create an account</button>
            </Link>
          </div>
        </div>
        {/* by attaching the id of the end of the header, the button will scroll down to the info  */}
        <a href="#end-of-header" className="learn-more-button"> </a>
      </header>
       {/* Ending of Header */}
      <div id="end-of-header"></div>
       {/* Start of the About Us */}
       <section className="about">
       <div className="box custom-box">
        <h1 className="right-side">To Bruins, By Bruins</h1>
        <p className="left-side">Hello! We are the group BigBytes, a five-member group that CS35L has brought together! The idea of Refer a Bruin came to us as computer science majors in hopes of creating a stepping stone for all majors in pursuit of professional development. With our great mentors joining Refer a Bruin, there are numerous opportunities presented for all Bruins to find security after our Bruin years.</p>
        </div>

 {/* End of About Us */}
      
       </section>

      {/* Beginning of Boxes  */}
      <section className="boxes">
        {/* Wanted to give the three features */}
        <div className="box">
          {/* The first feature */}
          <img className = "image" src="https://icons.veryicon.com/png/o/miscellaneous/general-icon-library/resume-7.png" alt="Resume Icon" />
          <h2>Resume Builder </h2>
          <p> Finding it hard to make a first impression? Let other mentors and peers help build the resume of your dreams. </p>
        </div>
        <div className="box">
          {/* Second Feature*/}
          <img className = "image" src="https://cdn3.iconfinder.com/data/icons/feather-5/24/search-512.png" alt="Search Icon" />
          <h2>Internship Search</h2>
          <p> 
            With our internship search, users are able to find an opportunitiy crafted to their own career development. </p>
        </div>
        <div className="box">
          {/* Third Feature */}
          <img className = "image" src="https://cdn-icons-png.freepik.com/512/3938/3938405.png" alt="Mentor Icon" />
          <h2>Mentor Matching</h2>
          <p> Users are able to find mentors through our app development, with finding similar career interests. By having mentors presented, they are able to provide users referrals if they find suitable. </p>
        </div>
      </section>
    </div>
  );
}