import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AuthNavbar from './AuthenticatedNavBar';
import auth from "../fb.js";
import { Form, FormControl } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../pages/Footer';
import "../Styling/Internships.css"

const JobDetail = () => {
  const [jobs, setJobs] = useState([]); // State to store internship data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [filterPay, setFilterPay] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [allCompany, setCompany] = useState('');
  const [allLocations, setAllLocations] = useState(new Set());
  const [allCategory, setCategory] = useState(new Set());

  const [selectedCategory, setSelectedCategory] = useState('');


  const applyFilters = async () => {
    setLoading(true); // Start loading

    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      // Construct query parameters from state
      let queryParams = new URLSearchParams({
        //possibly more filters based on demand --> have not yet added subcategories
        Company: filterCompany,
        Category: selectedCategory,
        Pay: filterPay,
        Location: filterLocation,

      }).toString();

      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`http://localhost:3001/api/v1/internship/QueryInternships?${queryParams}`, payloadHeader);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      setJobs(data.internshipData);
    } catch (error) {

    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

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

      // Using the token to fetch internships
      const response = await fetch('http://localhost:3001/api/v1/internship/GetAllInternships', payloadHeader);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setJobs(data.internshipData); // Assuming the response JSON structure matches our state


      //get all internship locations
      let allInternshipLocations;
      let allLocations;

      //if data.internshipData exists, extract all locations
      if (data.internshipData) {
        allInternshipLocations = Object.values(data.internshipData);
        allLocations = [...new Set(allInternshipLocations.map(job => job.Location))];
        setAllLocations(allLocations)
      }
      else {
        allLocations = new Set();
        setAllLocations(allLocations)
      }

      //get all companies
      let allCompanies;
      //if data.internshipData exists, extract all locations
      if (data.internshipData) {
        allCompanies = Object.values(data.internshipData);
        allCompanies = [...new Set(allCompanies.map(job => job.Company))];
        setCompany(allCompanies)
      }
      else {
        allCompanies = new Set();
        setCompany(allCompanies)
      }

      //get all Categories
      //get all companies
      let allCategory;
      //if data.internshipData exists, extract all locations
      if (data.internshipData) {
        allCategory = Object.values(data.internshipData);
        allCategory = [...new Set(allCategory.map(job => job.Category))];
        setCategory(allCategory)
      }
      else {
        allCategory = new Set();
        setCategory(allCategory)
      }

    } catch (error) {

    } finally {
      setLoading(false); // Ensure loading is set to false after the fetch operation completes
    }
  };


  const resetFilters = () => {
    fetchData();
  }



  const handleReferal = async (event) => {

    const user = auth.currentUser;
    const token = user && (await user.getIdToken());

    const payloadHeader = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const internshipID = event.target.value;
    try {
      const response = await fetch(`http://localhost:3001/api/v1/internship/RequestReferal?internshipID=${internshipID}`, payloadHeader);
      if (!response.ok) {
        toast.error('Resume does not exist. Please create one before proceeding.');
      }
      else {
        toast.success('you have succesfully requested a referal!');

      }


    } catch (error) {
    } finally {
      setLoading(false); // Ensure loading is set to false after the fetch operation completes
    }
  };


  useEffect(() => {
    // Define the asynchronous function inside the useEffect hook


    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount


  if (loading) {
    return <div>Loading...</div>; // Render a loading page or spinner here
  }

  return (
    <>
      <AuthNavbar />

      <Container fluid style={{ marginTop: '70px' }}>
        <Row className="mx-2">
          <Col xs={12} className="mb-5 filter-container">
            <h5 className='label-i'>Filters</h5>
            <Form >

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  as="select"
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)} >

                  <option value="">Select Company </option> {/*test*/}
                  {Array.from(allCompany).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                >
                  {/* main category */}
                  <option value="">Select Category</option>
                  {Array.from(allCategory).map((categoryKey) => (
                    <option key={categoryKey} value={categoryKey}>
                      {categoryKey}
                    </option>
                  ))}


                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Minimum Pay</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter pay"
                  value={filterPay}
                  onChange={(e) => setFilterPay(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)} >

                  <option value="">Select Location</option> {/*test*/}
                  {Array.from(allLocations).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}


                </Form.Control>

              </Form.Group>

              <Button className="me-2 intern-button" variant="primary" onClick={applyFilters}>
                <img className="intern-icon " src="https://cdn-icons-png.flaticon.com/512/107/107799.png" alt="Filter Icon" />
                Apply Filters
              </Button>
              {<Button variant="secondary intern-button" onClick={resetFilters}><img className="intern-icon" src="https://static.thenounproject.com/png/4800805-200.png" alt="Reset-Icon" /> Reset Filters</Button>}
            </Form>
          </Col>
          <Col sm={12}>
            {/* Job Listing Section */}
            <Row sm={12}>
              {Object.entries(jobs).map(([internshipID, job]) => (
                <Col md={12} key={internshipID}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title className='label-i'>{job.Title}</Card.Title>


                      <Card.Text><strong>Company:</strong> {job.Company}</Card.Text>
                      <Card.Text><strong>Location:</strong> {job.Location}</Card.Text>
                      <Card.Text className='padding-job'>{job.Description}</Card.Text>
                      <Button className="intern-button" value={internshipID} onClick={handleReferal}>Apply</Button>
                      <ToastContainer />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      {/*We wanted confetti to show up */}


      <Footer />
    </>

  );
};


export default JobDetail;


