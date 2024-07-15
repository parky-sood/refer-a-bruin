import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
//import { FaComment } from 'react-icons/fa'; // Assuming you're using react-icons for the comment icon
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import '../Styling/PDFViewer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



function ResumeViewer({ sendDataToParent, resumeUrl, resumeUID, resumeComments }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentResumeUID, setCurrentResumeUID] = useState(null); // Add this line

    const toggleComments = (e) => {
        setShowComments(!showComments);
        setCurrentResumeUID(e.target.value);
        //  // This will log the value of the button (resumeUID)
    }
    const submitComment = async () => {

        if (newComment.trim()) { // Avoid adding empty comments
            setComments([...comments, newComment]);
            setNewComment(''); // Reset input after submission
            sendDataToParent(true);   // log new comment
        }
        const requestBody = {
            resumeUID: currentResumeUID,
            comment: newComment
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        };
        try {
            // Make the fetch request to the server
            const response = await fetch('http://localhost:3001/api/v1/Resume/CommentOnResume', requestOptions);

            // Check if the request was successful
            if (response.ok) {
                const result = await response.json(); // Assuming the server sends back some data

                // Update local state with the new comment
                setComments(prevComments => [...prevComments, newComment]);
                setNewComment(''); // Clear the input after submission
            } else {
                // If the server response was not ok, log or handle the error
                console.error('Failed to submit comment:', response.statusText);
            }
        } catch (error) {
            // Log network or other errors to the console
            console.error('Error submitting comment:', error);


        }
    };

    return (
        <Col className="resume-viewer-container">
            {/* Column that shows resumes */}
            <Row>
                <Col sm={6}>
                    <Document file={resumeUrl}>
                        <Page pageNumber={1} width={600} />
                    </Document>
                </Col>
                {/* Column that shows comment section */}
                <Col sm={6}>
                    <Row>
                        <Button className="comment-button" value={resumeUID} onClick={toggleComments} variant="outline-primary" >
                            Comments
                        </Button>
                    </Row>
                    {/* Comment Section */}
                    {showComments && currentResumeUID === resumeUID && (
                        <Card className="comments-section">
                            <Card.Body>
                                <h5 className="label">Comments</h5>
                                {/* Divider */}
                                <div className="divider"></div>
                                {resumeComments && resumeComments.length > 0 ? (
                                    resumeComments.map((resComment, index) => (
                                        <div key={index} className="mb-2">
                                            <strong>{resComment.comment} </strong>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                                <Form.Group className="mb-3">
                                    {/* Add a comment, needs an input section */}
                                    <Form.Control
                                        as="textarea"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="comment-input"
                                    />
                                </Form.Group>
                                {/* allows to hit submit */}
                                <Button className="submit-button" onClick={submitComment} variant="primary">
                                    Submit
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Col>

    );
}
export default ResumeViewer;
