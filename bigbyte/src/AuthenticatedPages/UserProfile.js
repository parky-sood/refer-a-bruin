import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { Card, Button, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import AuthNavbar from './AuthenticatedNavBar';
import "../Styling/UserProfile.css";
import auth from "../fb.js"
import Footer from '../pages/Footer';


const UserProfile = () => {
  const [User, setUser] = useState([]); // State to store student information
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [notifications, setNotifications] = useState([]);
  const [viewReferals, setViewReferals] = useState(false);
  const [editFields, setEditFields] = useState(false);
  const [resume, setResume] = useState("");


  const handleResume = () => {
    // const resumeUrl = referals.notifications[index].data.Resume;
    window.open(resume, '_blank');
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...User, [name]: value });
  };

  const handleEditFields = async () => {

    setEditFields(false);

    // MAKE BACKEND REQUEST
    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      const payloadHeader = {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(User)
      };


      const response = await fetch('http://localhost:3001/api/v1/user/UpdateUser', payloadHeader);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setUser(data.userData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const User = auth.currentUser;
        const token = User && (await User.getIdToken());

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch('http://localhost:3001/api/v1/User/GetUser', payloadHeader);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setUser(data.user); // Assuming the response JSON structure matches our state
        setResume(data.URL);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }

      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch('http://localhost:3001/api/v1/user/ReferalStatus', payloadHeader)
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        console.error("Failed.");
      }

      setViewReferals(!viewReferals);
    };

    fetchData();
  }, []);


  if (loading) {
    return <div>Loading...</div>; // Render a loading page or spinner here
  }

  return (
    <>
      <AuthNavbar />
      <div style={{ padding: "120px" }}>
        <Card style={{ width: '100%', minHeight: '550px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Container style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {editFields ? (
              <>
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" name="FirstName" value={User.FirstName} onChange={handleInputChange} className="me-2" />
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" name="LastName" value={User.LastName} onChange={handleInputChange} className="me-2" />
                <Form.Label>Major</Form.Label>
                <Form.Control type="text" name="Major" value={User.Major} onChange={handleInputChange} className="me-2" />
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control type="text" name="GradYear" value={User.GradYear} onChange={handleInputChange} className="me-2" />
                <Form.Label>Bio</Form.Label>
                <Form.Control type="text" name="Bio" value={User.Bio} onChange={handleInputChange} className="me-2" />
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control type="text" name="LinkedIn" value={User.LinkedIn} onChange={handleInputChange} className="me-2" />

                <Button onClick={handleEditFields} className='mt-4'>Done</Button>
              </>
            ) : (
              <>
                <Row>
                  <Col>
                    <h1 className='mt-4 mb-2' style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>{User.FirstName} {User.LastName}</h1>
                    <h5 className="mb-1" style={{ color: '#666' }}>Student : Class of {User.GradYear}</h5>
                    <h6 className='' style={{ color: '#888' }}>Major: {User.Major}</h6>
                    <h6 className='' style={{ color: '#888' }}>Referals Left: {User.MonthlyRefferalCount}</h6>
                    <a href={User.LinkedIn} target="_blank"
                      rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>View LinkedIn</a>
                    <p className='mt-4' style={{
                      fontSize: '16px',
                      lineHeight: '1.5',
                      color: '#555'
                    }}>{User.Bio}</p>
                  </Col>
                </Row>
                <Row style={{ marginTop: 'auto' }}>
                  <Col className="d-flex justify-content-end">
                    <button type="button" onClick={() => handleResume()} className='mt-4 me-4' style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px' }}>View Resume</button>
                    <button type="button" onClick={() => setEditFields(true)} className='mt-4 me-4' style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px' }}>Edit</button>
                    {(!viewReferals) ? (
                      <button type="button" onClick={() => { setViewReferals(true) }} className='mt-4' style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px' }}>Show Referrals</button>
                    ) : (
                      <button typw="button" onClick={() => { setViewReferals(false) }} className='mt-4' style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px' }}>Hide Referrals</button>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </Card>

        <div>
          {viewReferals && (
            notifications.length > 0 ? (
              notifications.map((referal, index) => (
                <Row key={index} className='mt-4'>
                  <Card key={index}>
                    <Card.Title style={{ marginTop: "20px" }}>Position: {referal.InternshipTitle}</Card.Title>
                    <Card.Text>
                      {referal.Company && (
                        <div>Company: {referal.Company}</div>
                      )}

                      {/* <div>Status: {referal.status}</div> */}
                    </Card.Text>

                    <Row key={index} className='mb-3 d-flex'>
                      {(referal.status === "pending") && (
                        <button className='pending-btn button' type='button' disabled>Pending</button>
                      )}

                      {(referal.status === 'Accepted') && (
                        <button className='accept-btn button' type='button' disabled>Accepted</button>
                      )}
                      {(referal.status === 'Declined') && (
                        <button className='decline-btn button' type='button' disabled>Declined</button>
                      )}
                    </Row>
                  </Card>

                </Row>

              ))
            ) : (
              <h3>Loading referrals or no pending referrals currently</h3>
            )
          )}
        </div>

      </div>
      <Footer />
    </>

  );
};

export default UserProfile;