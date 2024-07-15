

const { signInWithEmailAndPassword } = require('firebase/auth');

const { Clientauth } = require('../fb.js');

const { db, admin } = require('../FireBaseSetUp.js');
const { addUser } = require('./Users.js');
const { addMentor } = require('./Mentors.js');

const Constants = require('./databaseConstant.js');
const UserRef = db.collection(Constants.COLLECTION_USERS);


// create and initialize a database reference to the "Internship" collection
const MentorRef = db.collection(Constants.COLLECTION_MENTORS);


exports.verifyToken = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // Verify the token
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      console.log("here mate")
      next(); // Proceed to the next middleware/function
    } else {
      // Token is invalid
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ success: false, message: 'Unauthorized: Authentication failed', error: error.message });
  }
};


exports.DetermineuserType = async (req, res, next) => {
  let userID = req.user.uid;


  let doc = await UserRef.doc(userID).get();
  if (!doc.exists) { //not a user collection check mentor
    let doc2 = await MentorRef.doc(userID).get();

    if (!doc2.exists) //not a mentor either
    {
      return res.status(500).json({ message: "error user does not exist in system" })
    }
    res.status(200).json({ user: "mentor" });
    return;

  }
  res.status(200).json({ user: "student" });
}

exports.IsStudent = async (req, res, next) => {
  let userID = req.user.uid;
  try {
    let doc = await UserRef.doc(userID).get();
    if (!doc.exists) {
      // If the document for the user doesn't exist in the student collection
      return res.status(500).json({ message: "Not a Student" });
    }
    next();
  }
  catch
  {
    //not a user collection check mentor
    return res.status(500).json({ message: "Not a student" });
  }
}

exports.IsMentor = async (req, res, next) => {
  let userID = req.user.uid;
  try {
    let doc2 = await MentorRef.doc(userID).get();
    if (!doc2.exists) {
      // If the document for the user doesn't exist in the MentorRef collection
      return res.status(500).json({ message: "Not a Mentor" });
    }
    next();
  } catch (error) {
    // Handle specific error types
    console.error("Error checking mentor status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }


}

exports.CreateDetailsAboutMentor = async (req, res) => {
  try {
    const mentorData = req.body
    let data = {
      FirstName: mentorData.firstName,
      LastName: mentorData.lastName,
      Company: mentorData.company,
      Bio: mentorData.bio || null,
      LinkedIn: mentorData.linkedIn || null,
      Industry: mentorData.industry,
      uid: req.user.uid,
      UserStatus: req.body.UserStatus
    };


    await addMentor(data)
    res.status(200).json({ success: true, message: 'Mentor data added correctly' });
  } catch (error) {
    console.error('Error signing up and creating mentor details:', error);
    res.status(500).json({ success: false, message: 'Error signing up and creating mentor details' });
  }
}

exports.CreateDetailsAboutUser = async (req, res) => {
  try {
    const userData = req.body;
    const data = {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Major: userData.major,
      GradYear: userData.gradYear,
      Bio: userData.bio || null,
      Organizations: userData.organizations || [],
      LinkedIn: userData.linkedIn || null,
      UserStatus: userData.UserStatus,
      uid: req.user.uid,

      //not provided by entered data
      MonthlyRefferalCount: 20,
      Resume: false,
      TotalRefferalCount: 0,
    };

    await addUser(data)
    res.status(200).json({ success: true, message: 'User data added correctly' });
  } catch (error) {
    console.error('Error signing up and creating user details:', error);
    res.status(500).json({ success: false, message: 'Error signing up and creating user details' });
  }
}

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(Clientauth, email, password);
    const user = userCredential.user;

    //const customToken = await admin.auth().createCustomToken(user.uid);


    // If login is successful, return user data
    // res.json({ token: customToken , success:true});
    res.json({ success: true });
    next();

  } catch (error) {
    // If there's an error, return an error message
    console.log(error);
    res.status(401).json({ sucess: false, message: 'Authentication failed. Please check your credentials.' });
  }

}
//signout functionality....... test this more. see how to use in postman
//build in login rout

exports.SignOut = async (req, res) => {
  try {
    if (req.user) {
      await admin.auth().revokeRefreshTokens(req.user.uid);
      res.json(
        { message: 'User successfully signed out' }
      );
    } else {
      res.status(401).json(
        { message: 'user not authenticated' });
    }
  } catch (e) {
    res.status(500).json(
      {
        message: 'error: user wont sign out',
      });

  }

};
exports.RedirectToStore = (req, res) => {
  const frontendRedirectUrl = '/store';
  res.json({ data: "SingUp successful", redirectUrl: frontendRedirectUrl });
}
exports.RedirectToInternships = (req, res) => {
  //const frontendRedirectUrl = '/store';
  res.json({ success: false, redirectUrl: frontendRedirectUrl });
}