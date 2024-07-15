import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import auth from "../fb.js";

function UserDetailsForm() {
    const [role, setRole] = useState('');
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        major: '',
        gradYear: '',
        bio: '',
        company: '',
        UserStatus: '',
        linkedIn: '',
        industry: '',
        organizations: ''
    });
    const [redirectToLanding, setRedirectToLanding] = useState(false);
    const [failedSignUp, setFailedSignUp] = useState(false);

    const handleButtonClick = (selectedRole) => {
        setRole(selectedRole);
        setUserDetails({
            ...userDetails,
            UserStatus: selectedRole
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send userDetails to backend for further processing
        if ((role === 'student' && (userDetails.firstName === '' || userDetails.lastName === '' || userDetails.gradYear === '' || userDetails.major === '')) ||
            (role === 'mentor' && (userDetails.firstName === '' || userDetails.lastName === '' || userDetails.company === ''))) {
            setFailedSignUp(true);
            console.error("Required fields are missing");
            return; // Prevent further execution of form submission
        }

        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        console.log(user, "user");
        console.log("tojen", token);

        // split organization string by commas into a list for Users
        if (userDetails && typeof userDetails.organizations === 'string') {
            // Split the organizations string and map each organization
            userDetails.organizations = userDetails.organizations.split(',').map(org => org.trim());

        } else {


            userDetails.organizations = null;
        }



        const payloadHeader = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userDetails)
        };

        let response;

        //if signing up a user
        if (role == "student") {
            response = await fetch('http://localhost:3001/api/v1/user/UserDetails', payloadHeader);
        } else {
            //if signing up a mentor
            response = await fetch('http://localhost:3001/api/v1/mentor/MentorDetails', payloadHeader);
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            setRedirectToLanding(true);
        } else {
            throw new Error('There was a problem with your post operation');
        }
    };


    if (redirectToLanding) {
        return <Navigate to="/Internships" />;
    }

    return (
        <div >
            <h1>Select Your Role</h1>
            <Button onClick={() => handleButtonClick('student')} variant="primary">Student</Button>{' '}
            <Button onClick={() => handleButtonClick('mentor')} variant="success">Mentor</Button>{' '}

            {role &&
                <div>
                    <h2>User Details Form</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="firstName">
                            <Form.Label>*First Name:</Form.Label>
                            <Form.Control type="text" name="firstName" value={userDetails.firstName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>*Last Name:</Form.Label>
                            <Form.Control type="text" name="lastName" value={userDetails.lastName} onChange={handleChange} />
                        </Form.Group>
                        {role === 'student' &&
                            <>
                                <Form.Group controlId="major">
                                    <Form.Label>*Major:</Form.Label>
                                    <Form.Control type="text" name="major" value={userDetails.major} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="bio">
                                    <Form.Label>Bio:</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="bio" value={userDetails.bio} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="gradYear">
                                    <Form.Label>*Graduation Year:</Form.Label>
                                    <Form.Control type="text" name="gradYear" value={userDetails.gradYear} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="organizations">
                                    <Form.Label>Organizations (seperated by commas):</Form.Label>
                                    <Form.Control type="text" name="organizations" value={userDetails.organizations} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="linkedIn">
                                    <Form.Label>LinkedIn:</Form.Label>
                                    <Form.Control type="text" name="linkedIn" value={userDetails.linkedIn} onChange={handleChange} />
                                </Form.Group>

                            </>
                        }
                        {role === 'mentor' &&
                            <>
                                <Form.Group controlId="company">
                                    <Form.Label>*Company:</Form.Label>
                                    <Form.Control type="text" name="company" value={userDetails.company} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="industry">
                                    <Form.Label>Industry:</Form.Label>
                                    <Form.Control type="text" name="industry" value={userDetails.industry} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="bio">
                                    <Form.Label>Bio:</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="bio" value={userDetails.bio} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="linkedIn">
                                    <Form.Label>LinkedIn:</Form.Label>
                                    <Form.Control type="text" name="linkedIn" value={userDetails.linkedIn} onChange={handleChange} />
                                </Form.Group>
                            </>
                        }
                        {failedSignUp &&
                            <div>
                                <p style={{ color: "red" }}>All fields required. Try again...</p>
                            </div>
                        }
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </div>}
        </div>
    );
}

export default UserDetailsForm;
