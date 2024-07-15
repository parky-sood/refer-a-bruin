import React from 'react';
import { Link } from "react-router-dom";

/* the function navbar is able to provide access to pages and interconnect our website*/
const NavBar = () => {
    return (
      <nav className='fixed-top pt-3'>
        <ul>
          <img
            src="https://1000logos.net/wp-content/uploads/2017/11/UCLA-Logo.png"
            style={{ width: "100px" }}
            alt="logo"
          />
  
          <li className='ps-4'><Link to="/Home">Home</Link></li>
          {/*Commented out About and Contact in hopes of being cleared by team to remove since they are in home page*/}
          {/* <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li> */}

          <li>
            {/* <Link to="/InternShips">Internship Search</Link>
            <Link to="/Resume">Resume Tools</Link>
            <Link to="BackendTesting">Backend Testing</Link> */}
            <div  className= "rightt-links">
            <Link className= "login-sign-title" to="/Login">Login</Link>
            <Link  className= "login-sign-title" to="/SignUp">Sign Up</Link>
            </div>
            {/* Want to see its css but access it due to sign up  */}

            
          </li>
  
        </ul>
      </nav>
    );
  
  }

  export default NavBar;