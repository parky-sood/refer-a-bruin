import React, { useState } from 'react';
import '../Styling/Signup.css';
import NavBar from './VisitNavBar.js';
import {Container, Form, Row, Col, Card, Button} from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuth } from ".././AuthContext.js";

export default function Signup () 
{
const [email, setemail] = useState('');
const [password, setPassword] = useState('');
const [redirectToUserData, setRedirectToUserData] = useState(false);
const { register, setError } = useAuth();
const [failedSignUp, setFailedSignUp] = useState(false);



const handleEmailChange = (event) => {
  setemail(event.target.value);
    setFailedSignUp(false);
};

const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setFailedSignUp(false);
};

const SignUserUp = async () => {
  try {
    
    await register(email, password);
    setRedirectToUserData(true);
    setFailedSignUp(false);

  } catch (e) {
    setError("Failed to register");
    setFailedSignUp(true);
  }
};

// const SignUserUp = () =>

// {
//     const postData = {
//         email: email,
//         password: password
//       };
      
//       fetch('http://localhost:3001/api/v1/user/SignUp', {
//         method: 'POST',
//          headers: {
//            'Content-Type': 'application/json'
//          },
//         body: JSON.stringify(postData)
//       })
//       .then(response => {
//         if (!response.ok) {
//             console.log(response);
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
        
//         // Check if the login was successful
//         if (data.success) {
//           // Redirect to the next page
//           setRedirectToUserData(true);
//         } else {
//           console.error('Login failed:', data.message);
//           // Handle login failure
//         }
//       })
//       .catch(error => {
//         console.error('There was a problem with your fetch operation:', error);
//       });
// }

if (redirectToUserData) {
  return <Navigate to="/UserData" />;
}
    return (
      <>
        <NavBar />
        {/* WORKING CODE FOR SIGNUP. FAILING CODE COMMENTED UNDER */}
        {/* <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col xs={12} md={8} lg={6}>
                    <Card style={{ width: '500px', padding: '30px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Title  className='mb-3' style={{fontSize: '32px'}}>Sign Up</Card.Title>
                        <div>
                            <Form>
                                <Form.Group controlId="username">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={email} 
                                        onChange={handleEmailChange} 
                                        placeholder="Enter your email" 
                                    />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label className='mt-2'>Password:</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={password} 
                                        onChange={handlePasswordChange} 
                                        placeholder="Enter your password" 
                                    />
                                </Form.Group>
                                <Button 
                                    className='mt-4'
                                    onClick={SignUserUp} 
                                    type="submit" 
                                    style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}
                                >
                                    Sign Up
                                </Button>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container> */}
         <div className="right-side-img">
         {/* <h1 className="text-in-container, h1">Welcome to Refer a Bruin.</h1>
             <p className="text-in-container, p "> Create your account and create the network of a lifetime.</p> */}
         </div>
         <div className='signup-form left-side'> 
         <h2 className='label'> Create an Account </h2>
          <label  htmlFor="username">Email:</label>
          <input 
              type="text" 
              id="username" 
              value={email} 
              onChange={handleEmailChange} 
              placeholder="Place your email here" 
          />
          <label htmlFor="password">Password:</label>
          <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="Enter your password" 
          />
             {failedSignUp &&
                 <div className='mt-4'>
                     <p style={{color: "red"}}>An account with this email already exists.</p>
                 </div>
             }
          <button className = "signup-btn" onClick={SignUserUp} type="submit">Sign Up</button>
          </div>
      </>
    );
}