import React, { useState,useEffect  } from 'react';
import Button from 'react-bootstrap/Button';
import '../Styling/Login.css';
import NavBar from './VisitNavBar.js';
import {Link, Navigate } from 'react-router-dom';

import { useAuth } from ".././AuthContext.js";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [redirectToUserData, setRedirectToUserData] = useState(false);
    const { currentUser, login, setError } = useAuth();

    const [failedLogin, setFailedLogin] = useState(false);
    // useEffect(() => {
    //     if (currentUser) {
    //     setRedirectToUserData(true)
    //     }
    //   }, [currentUser]);
    
   const handleLogin2 = async () =>{
        
    
        try {
          //setError("");
          //setLoading(true);
          await login(username, password);
          setRedirectToUserData(true);
          setFailedLogin(false);
        } catch (e) {
          //setError("Failed to login");
          setRedirectToUserData(false);
          setFailedLogin(true);
        }
      }

    // const handleLogin = () => {
    //     const postData = {
    //         email: username,
    //         password: password
    //     };

    //     fetch('http://localhost:3001/api/v1/user/login', {
    //         method: 'POST',
    //          headers: {
    //            'Content-Type': 'application/json'
    //          },
    //         body: JSON.stringify(postData)
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log('Response from server:', data);
    //         // Check if the login was successful
    //         if (data.success) {
    //             // Redirect to the next page
    //             setRedirectToUserData(true);
    //         } else {
    //             console.error('Login failed:', data.message);
    //             // Handle login failure
    //         }
    //     })
    //     .catch(error => {
    //         console.error('There was a problem with your fetch operation:', error);
    //     });
    // };
 

    //uncoment this once we have a page created 
     if (redirectToUserData) {
         return <Navigate to="/Internships" />;
       }

    return (
      <>
      <NavBar />
      {/*Created a class name for full page container in order to find a way to create a background for login page */}
      <div className='full-page-container'>
        {/*Login*/}
        <div className="Login">
            <div className="form-elements">
              <h2 className='label'> Welcome Back!</h2>
              <div className='column'>
                {/*Username*/}
                  <label htmlFor="username">Email:</label>
                  <input
                      type="text"
                      id="username"
                      value={username}
                      placeholder='e.g. joebruin@ucla.edu '
                      onChange={(e) => setUsername(e.target.value)}
                  />
              </div>
              <div className='column'>
                {/*Password*/}
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      placeholder='e.g. Cafe1919! '
                      onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              {failedLogin && 
              <div>
                <p style={{color: "red"}}>Incorrect email or password.</p>
              </div>
              }
              <div className = "form-group">
                {/*Log-in */}
              <Button className = "login-btn" onClick={handleLogin2}>Log in</Button>
            </div>
            </div>
        </div>
      </div>
      </>
    );
}