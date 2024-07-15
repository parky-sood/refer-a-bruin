import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AuthNavbar from './AuthenticatedNavBar';
import auth from "../fb.js";
import { Modal, Form, FormControl } from 'react-bootstrap';

import "../Styling/MentorSearch.css"

const MentorSearch = () => {
  const [Mentors, setMentors] = useState([]); // State to store mentor data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [allCompanies, setAllCompanies] = useState(new Set());
  const [allIndustries, setAllIndustries] = useState(new Set());
  const [filterCompany, setFilterCompany] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  //state variable for viewing an internship
  const [showModal, setShowModal] = useState(false);
  const [viewMentorProfile, setViewMentorProfile] = useState(false);
  const [mentorProfileData, setMentorProfileData] = useState([]);
  const [mentorInternshipData, setMentorInternshipData] = useState([]);


  const fetchData = async () => {

    try {
      // Fetching the auth token
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Using the token to fetch mentors
      const response = await fetch('http://localhost:3001/api/v1/mentor/GetAllMentors', payloadHeader);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      setMentors(data.mentorData); // Assuming the response JSON structure matches our state

      let mentorCompany;
      //if data.mentorData exists, extract all locations
      if (data.mentorData) {
        mentorCompany = Object.values(data.mentorData);
        mentorCompany = [...new Set(mentorCompany.map(job => job.Company))];
        setAllCompanies(mentorCompany)
      }
      else {
        mentorCompany = new Set();
        setAllCompanies(mentorCompany)
      }

      let mentorIndustry;
      //if data.mentorData exists, extract all locations
      if (data.mentorData) {
        mentorIndustry = Object.values(data.mentorData);
        mentorIndustry = [...new Set(mentorIndustry.map(job => job.Industry))];
        setAllIndustries(mentorIndustry)
      }
      else {
        mentorIndustry = new Set();
        setAllIndustries(mentorIndustry)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after the fetch operation completes
    }
  };

  const resetFilters = async () => {
    fetchData();

  }
  //apply filters
  const applyFilters = async () => {
    setLoading(true); // Start loading

    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      // Construct query parameters from state
      let queryParams = new URLSearchParams({
        Company: filterCompany,
        Industry: filterIndustry,
      }).toString();

      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`http://localhost:3001/api/v1/mentor/QueryMentors?${queryParams}`, payloadHeader);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      const messyMentorData = data.mentorData;
      const cleanMentorData = Object.keys(messyMentorData).map(key => ({
        id: key,
        ...messyMentorData[key]
      }));

      setMentors(Object.values(cleanMentorData));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };


  useEffect(() => {
    // Define the asynchronous function inside the useEffect hook
    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  const viewProfile = async (mentorID) => {
    setViewMentorProfile(true);
    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      let queryParams = new URLSearchParams({
        id: mentorID,
      }).toString();

      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`http://localhost:3001/api/v1/mentor/ViewMentorProfile?${queryParams}`, payloadHeader);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json()
      setMentorProfileData(data.mentorData);
      setMentorInternshipData(data.internshipData);

      toggleModal();

    } catch (error) {
      console.error("Error fetching mentor data:", error);
    }

  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const MentorModal = () => {
    return (
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center"><strong>{mentorProfileData.FirstName} {mentorProfileData.LastName}'s</strong> Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mentor profile */}
          <div className="profile-section">
            <h5 className="text-center"><strong>Mentor Profile</strong></h5>
            <p><strong>Company:</strong> {mentorProfileData.Company}</p>
            <p><strong>Industry:</strong> {mentorProfileData.Industry}</p>
            <p>
          <strong>LinkedIn:</strong> 
          <a href={mentorProfileData.LinkedIn} target="_blank" rel="noopener noreferrer">
            {mentorProfileData.LinkedIn}
          </a>
          </p>
            <p><strong>Bio:</strong> {mentorProfileData.Bio}</p>
          </div>

          {/* Thick divider */}
          <hr className="thick-divider" />

          {/* Active internships */}
          <div className="internship-section">
            <h5 className="text-center"><strong>Active Internships</strong></h5>
            {Object.values(mentorInternshipData).map((internship, index) => (
              <div key={index}>
                <p><strong>Name:</strong> {internship.Title}</p>
                <p><strong>Company:</strong> {internship.Company}</p>
                <p><strong>Location:</strong> {internship.Location}</p>
                <p><strong>Category:</strong> {internship.Category}</p>
                <p><strong>Pay:</strong> {internship.Pay}</p>
                <p><strong>Description:</strong> {internship.Description}</p>
                {/* Thin divider */}
                {index !== Object.values(mentorInternshipData).length - 1 && <hr className="thin-divider" />}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };



  if (loading) {
    return <div>Loading...</div>; // Render a loading page or spinner here
  }

  return (
    <>
      <AuthNavbar />

      <h5>Filters</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control
            as="select" value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}>

            {/* Options for companies */}
            <option value="">Select Company</option>
            {Array.from(allCompanies).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Industry</Form.Label>
          <Form.Control
            as="select"
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
          >
            <option value="">Select Industry</option>
            {Array.from(allIndustries).map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {<Button variant="primary" onClick={applyFilters} className="me-4">Apply Filters</Button>}
        {<Button variant="primary" onClick={resetFilters}> Reset Filters</Button>}
      </Form>

      {/*</Form>*/}
      <Row  style={{ paddingTop: "30px" }}>
        {Object.entries(Mentors).map(([mentorID, mentor]) => (
          <Col md={12}>
            <Card className="mb-3 mentor-card">
              <Card.Body>
                <Card.Text><strong>Company:{ mentor.Company} </strong> </Card.Text>
                <Card.Text className="company"><strong >Name:</strong> { mentor.FirstName} {mentor.LastName}</Card.Text>
                <Card.Text className="bio"><strong>Bio:</strong> { mentor.Bio} </Card.Text>
                <Card.Text>
                  {/*<strong>LinkedIn:</strong>{" "}*/}
                  {/*<a href={`https://${mentor.LinkedIn}`} target="_blank" rel="noopener noreferrer">*/}
                  {/*  {mentor.LinkedIn}*/}
                  {/*</a>*/}
                </Card.Text>

                <a href={`${mentor.LinkedIn}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="me-4">Contact - LinkedIn</Button>
                </a>

                <Button variant="primary" onClick={() => viewProfile(mentor.id)}>View Mentor Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <MentorModal />

    </>
  );
};

export default MentorSearch;