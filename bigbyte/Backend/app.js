const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');



// Define your custom middleware first

// Then, define the CORS middleware

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser()); 

app.use(fileUpload()); //allows us to grab files via request


app.use((req, res, next) => {
  console.log("Inside custom missleware");
  res.status(200); // Set the status before sending any response
  next(); // Call next to pass control to the next middleware/route handler
});


app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend domain
  credentials: true, // Allow credentials (cookies, authentication headers, etc.)
}));

app.get('/', (req, res) => {
  res.status(200).send('Hello from Exp33resqqs!'); // Send a simple response

}); //when data sent ehre then it will follow to other middlewear


const userRouter = require('./routes/UserRoutes');
const InternshipRouter = require('./routes/InternShipRoutes');
const MentorRouter = require('./routes/MentorRoutes');
const ResumeRouter = require('./routes/ResumeRoutes');


app.use('/api/v1/user', userRouter);
app.use('/api/v1/Resume', ResumeRouter);
app.use('/api/v1/internship', InternshipRouter);
app.use('/api/v1/mentor', MentorRouter);




module.exports = app;