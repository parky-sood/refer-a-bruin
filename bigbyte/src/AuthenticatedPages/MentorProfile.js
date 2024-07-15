import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import AuthNavbar from './AuthenticatedNavBar';
import auth from "../fb.js";
import { Navigate } from 'react-router-dom';
import Footer from '../pages/Footer';
import "../Styling/MentorProfile.css"
//import {getAllInternships} from "../../Backend/controllers/Internships";


const MentProfile = () => {
    const [loading, setLoading] = useState(false);
    const [mentor, setMentor] = useState([]);
    const [editFields, setEditFields] = useState(false);
    const [referals, setReferals] = useState([]);
    const [viewReferals, setViewReferals] = useState(false);
    const [IsMentor, setIsMentor] = useState(true);
    const [allInternships, setallInternships] = useState([]);
    const [condInternship, setcondInternship] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                const token = user && (await user.getIdToken());

                const payloadHeader = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch('http://localhost:3001/api/v1/mentor/GetMentor', payloadHeader);
                if (!response.ok) {
                    setIsMentor(false);

                }

                const data = await response.json();
                setMentor(data.user);

                //console.log(data.user)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }



            // load referrals
            const user = auth.currentUser;
            const token = user && (await user.getIdToken());

            const payloadHeader = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch('http://localhost:3001/api/v1/mentor/RequestedReferals', payloadHeader);
            if (!response.ok) {
                setIsMentor(false);
            }

            const data = await response.json();
            setReferals(data);


            // //get all internships for a mentor
            //   const response = await fetch('http://localhost:3001/api/v1/mentor/RequestedReferals', payloadHeader);
            //   console.log(response.message, "response")
            //   if (!response.ok) {
            //       setIsMentor(false);
            //   }
            //
            //   const data = await response.json();


        };


        fetchData();

    }, []);

    if (!IsMentor) {
        return <Navigate to="/Error"></Navigate>
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMentor({ ...mentor, [name]: value });
    };

    const handleDone = async () => {

        // ONCE THIS WORKS, COPY AND PASTE INTO USERPROFILE

        // move this line to the data.success check
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
                body: JSON.stringify(mentor)
            };

            const response = await fetch('http://localhost:3001/api/v1/mentor/UpdateMentor', payloadHeader);
            if (!IsMentor) {
                return <Navigate to="/"></Navigate>
            }

            const data = await response.json();
            //setMentor(data.user);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }


    };

    if (loading) {
        return <div>Loading...</div>;
    }


    const handleResume = async (index) => {
        const resumeUrl = referals.notifications[index].data.Resume;
        window.open(resumeUrl, '_blank');
    }

    const FetchUpdate = async (referalId, payload) => {
        try {
            const user = auth.currentUser;
            const token = user && (await user.getIdToken());

            const payloadHeader = {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            };

            const response = await fetch(`http://localhost:3001/api/v1/mentor/UpdateRefStatus?${referalId}`, payloadHeader);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            //     //setMentor(data.user);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    //handle See all internships for specific mentor
    const allInternshipsForMentor = async () => {
        // let referalId= referals.notifications[index].id;

        setcondInternship(!condInternship);

        const payload = {
            status: "Accepted"
        };

        //await FetchUpdate(referalId, payload)

        // reload referrals
        const mentor = auth.currentUser;
        const token = mentor && (await mentor.getIdToken());

        const payloadHeader = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch('http://localhost:3001/api/v1/internship/GetMentorsInternships', payloadHeader);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        //all internships for mentor

        const data = await response.json();

        console.log(data.internshipData, "dats");

        //const mentorIds = new Set(Object.values(data.internshipData).map(item => item.MentorID));

        //iterate all internships and get specific internship for particular mento
        // Object.values(data.internshipData).forEach(item => {
        //     if (item.MentorID === mentor.uid) {
        //         // Perform actions when the MentorID matches the mentor's uid
        //         // console.log('MentorID matched:', item.MentorID);
        //         allInternshipswithMentor.push(item);
        //     } else {
        //         // Perform actions when the MentorID does not match the mentor's uid
        //         //console.log('MentorID not matched:', item.MentorID);
        //     }
        // });


        setallInternships(data.internshipData);

        //for all resumes, if mentor.uid == item.MentorID
        //

        //setReferals(data);

    }

    const handleAccept = async (index) => {
        let referalId = referals.notifications[index].id;


        const payload = {
            status: "Accepted"
        };

        await FetchUpdate(referalId, payload)

        // reload referrals
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        const payloadHeader = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch('http://localhost:3001/api/v1/mentor/RequestedReferals', payloadHeader);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setReferals(data);

    }

    //delete internship button
    const handleDeleteInternship = async (InternshipID) => {
        // Implement logic to delete the internship with the given ID
        

        console.log(InternshipID, "intenrship ID");

        //fetch request
        //callDelete endpoint

        try {
            const user = auth.currentUser;
            const token = user && (await user.getIdToken());

            const payloadHeader = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(`http://localhost:3001/api/v1/internship/DeleteInternship?${InternshipID}`, payloadHeader);
            const data = await response.json();
            console.log(data, "data");
            //setMentor(data.user);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }


    };

    const handleDecline = async (index) => {

        let referalId = referals.notifications[index].id;
        //   referals.notifications[index].data.status = "declined";

        //   referalStatus= "declines"
        const payload = {
            status: "Declined"
        };


        await FetchUpdate(referalId, payload);
        // MAKE BACKEND REQUEST FOR REF STATUS = DECLINE

        // reload referrals
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        const payloadHeader = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch('http://localhost:3001/api/v1/mentor/RequestedReferals', payloadHeader);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setReferals(data);

    }

    return (
        <>
            <AuthNavbar />
            <div style={{ padding: "120px" }}>
                <Card style={{ width: '100%', minHeight: '550px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    {/* Hard coded a profile picture */}
                    <div className="profile-picture-container">
                        <img src={"https://www.research.fsu.edu/media/6334/rma_logo.png"} alt="Profile" className="profile-picture" />
                    </div>
                    {/* Input Fields  */}
                    <Container style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {editFields ? (
                            <>
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="text" name="FirstName" value={mentor.FirstName} onChange={handleInputChange} className="me-2" />
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" name="LastName" value={mentor.LastName} onChange={handleInputChange} className="me-2" />
                                <Form.Label>Company</Form.Label>
                                <Form.Control type="text" name="Company" value={mentor.Company} onChange={handleInputChange} className="me-2" />
                                <Form.Label>LinkedIn</Form.Label>
                                <Form.Control type="text" name="LinkedIn" value={mentor.LinkedIn} onChange={handleInputChange} className="me-2" />
                                <Form.Label>Bio</Form.Label>
                                <Form.Control type="text" name="Bio" value={mentor.Bio} onChange={handleInputChange} className="me-2" />
                                <Button onClick={handleDone} className='mt-4'>Done</Button>
                            </>
                        ) : (
                            <>
                                <Row>
                                    <Col>
                                        {/* header for Name   */}
                                        <h1 className='mt-4 mb-2' style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#333'
                                        }}>{mentor.FirstName} {mentor.LastName}</h1>
                                        {/* Mentor */}
                                        <h5 className="mb-1" style={{ color: '#666' }}>Mentor</h5>
                                        {/* Company*/}
                                        <h6 style={{ color: '#888' }}>{mentor.Company}</h6>
                                        {/* Linked in  */}
                                        <a href={mentor.LinkedIn} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                                            {/* No content I want the picture to represent */} </a>
                                        {/* Bio */}
                                        <p className='bio' style={{
                                            fontSize: '16px',
                                            lineHeight: '1.5',
                                            color: '#555'
                                        }}>{mentor.Bio}</p>
                                    </Col>
                                    {/* Row for button */}
                                </Row>
                                {/* Button for View Referals  */}
                                <Row style={{ marginTop: 'auto', alignItems: 'flex-end' }}>
                                    <Col className="d-flex justify-content-end">
                                        {/* Edit Button */}
                                        <Button onClick={() => setEditFields(true)} className='mt-4 me-4 referal form-button' >Edit your Profile</Button>
                                        {(!viewReferals) ? (
                                            <Button onClick={() => { setViewReferals(true) }} className='mt-4 form-button' >Show Referrals</Button>
                                        ) : (
                                            <Button onClick={() => { setViewReferals(false) }} className='mt-4 form-button' >Hide Referrals</Button>
                                        )}
                                        {/*<Button onClick={allInternshipsForMentor} className='mt-4' style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px' }}>View Internships</Button>*/}
                                        {/* condInternship */}
                                        {/* Show dropdown when condInternship is true */}

                                        {/* Hide dropdown when condInternship is false */}
                                        {/* button for View Internships  */}

                                        <Button onClick={allInternshipsForMentor} className='mt-4 form-button left-button-mp'>
                                            {condInternship ? "Hide Internships" : "View Internships"}
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Container>
                </Card>

                <div>
                    {/* button for See Referals (Accept, Decline, etc)   */}
                    {viewReferals && (
                        referals.notifications.length > 0 ? (
                            referals.notifications.map((referal, index) => (
                                referal.data.status === "pending" && ( // Add the conditional statement here
                                    <Row key={index} className='mt-4'>
                                        <Card key={index}>
                                            <Card.Title style={{ marginTop: "20px" }}>Position: {referal.data.InternshipTitle}</Card.Title>
                                            <Card.Text>
                                                Applicant Bio: {referal.data.studentBio}
                                            </Card.Text>
                                            {/* Accept, Decline, and View Resume Buttons  */}
                                            <Row key={index} className='mb-3'>
                                                <Col key={index}>
                                                    <Button className="resume-btn" onClick={() => handleResume(index)}> View Resume </Button>
                                                </Col>
                                                <Col key={index + 1}>
                                                    <Button className='accept-btn' value={referals.id} onClick={(e) => handleAccept(index)}> Accept </Button>
                                                </Col>
                                                <Col key={index + 2}>
                                                    <Button className='decline-btn' value={referals.id} onClick={(e) => handleDecline(index)}> Decline </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Row>
                                )
                            ))
                        ) : (
                            <h3>Loading referrals or no pending referrals currently</h3>
                        )
                    )}
                </div>
                <div>
                    {condInternship && (
                        <div className='mt-4 container-mp'>
                            {/* Render list of all internships */}
                            <h6 className="title-mp" style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}>All Internships</h6>
                            <ul className="list-mp">
                                {allInternships.map((internship, index) => (
                                    <div className='internship-item' key={index}>
                                        <div className='internship-title'>
                                            <div className="dividerr dividerr-top"></div>
                                            {internship.data.Company} - {internship.data.Title} - {internship.data.URL}
                                            {/* Delete button */}
                                            <Button onClick={() => handleDeleteInternship(internship.id)} className='ml-2 form-button left-button delete-button' variant="danger">Delete</Button>
                                            {/* Divider */}
                                            <div className="dividerr "></div>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

            </div>
            <Footer />
        </>
    );
};

export default MentProfile;
