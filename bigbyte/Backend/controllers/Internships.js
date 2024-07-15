
const { db } = require('../FireBaseSetUp.js');
const Constants = require('./databaseConstant.js');
const { getDocument, filterHelper } = require('./databaseFunctions.js');

// create and initialize a database reference to the "Internship" collection
const InternshipRef = db.collection(Constants.COLLECTION_INTERNSHIP);

const MentorNotificationsRef = db.collection(Constants.COLLECTION_MENTORS_NOTIFICATIONS);
const UserRef = db.collection(Constants.COLLECTION_USERS);

// add an internship taking in a request --> SHOULD ONLY BE CALLED VIA generateInternship FROM MENTORS.JS
exports.addInternship = async (req, res) => {
  try {
    // initialize the body of response data to become the data
    const internshipData = req.body;
    const MentorID = req.user.uid;

    const data = {
      //input all data from req.body json object
      Title: internshipData.title,
      Company: internshipData.company,
      Description: internshipData.description,
      Location: internshipData.location,
      Pay: internshipData.pay || null,
      Category: internshipData.category || [],
      URL: internshipData.url,
      ReferalLimit: internshipData.referralLimit,
      MentorID: MentorID, //how we link internships to a mentor

      //not provided by entered data
      ApplicationCounter: 0,
      Display: true,
      Status: Constants.INTERNSHIP_STATUS_OPEN,
    };

    // add the internship with a random ID
    const newInternshipRef = InternshipRef.doc();
    await newInternshipRef.set(data);

    return;

    // unneccesary as the only result needed is from generateInternship in Mentors.js (which this function is solely called from)
    //res.status(200).json({ success: true, message: 'Internship added successfully' });
  } catch (error) {

    res.status(500).json({ message: 'Internship was not created', success: false });
  }
};

exports.requestReferal = async (req, res) => {
  let student = req.student; //get usersname, and resume, and linkdln?

  const internshipID = req.query.internshipID;


  const internshipDoc = await InternshipRef.doc(internshipID).get();



  if (!internshipDoc) {
    return res.status(500).json({ message: "create a profile", resume: false })
  }
  const mentorID = internshipDoc.data().MentorID;

  // Create a notification document for the mentor
  const notificationData = {
    mentorID: mentorID,
    studentID: student.userID,
    company: internshipDoc.data().Company || '',
    internshipURL: internshipDoc.data().URL || '',
    InternshipTitle: internshipDoc.data().Title || '',
    studentMajor: student.Major || '',
    GradYear: student.Year || '',
    studentOrganizations: student.Organizations || '',
    studentBio: student.Bio || '',
    Resume: student.Resume || '',
    message: `Referral request for your internship: ${internshipDoc.data().Title}`,
    status: "pending",
    internshipID: internshipID
  };


  const newMentorNotificationsRef = MentorNotificationsRef.doc();
  await newMentorNotificationsRef.set(notificationData);

  let MentorDeletesInternship = false; //only true when a mentor wants to delte the internship
  updateInternshipData(internshipID, InternshipRef, internshipDoc.data(), MentorDeletesInternship);
  updateUserData(student.userID);

  res.status(200).json({ sucess: "sucess" })

}

exports.getAllInternshipsRelatedToAMentor = async (req, res) => {
  const mentorID = req.user.uid;

  try {
    // Query the Internship collection to get all internships where MentorID equals mentorID
    const internshipSnapshot = await InternshipRef.where('MentorID', '==', mentorID).get();

    // Initialize an array to store internship data
    const internshipData = [];

    // Iterate over the documents in the snapshot
    internshipSnapshot.forEach(doc => {
      // Get the data of each document and push it to the internshipData array
      if (doc.data().Display !== false) {
        internshipData.push({

          id: doc.id, // Document ID

          data: doc.data() // Other fields...
        });
      }

    });
    res.status(200).json({ success: true, internshipData: internshipData });

    //get mentorID, have it query all interships related to a mentr
  }
  catch
  {
    res.status(500).json({ success: false, message: 'Error querying internships' });
  }
}
//query ALL Internships based on a specific field, filtering technique, and target value --> returns dictionary of ALL internship IDs to their data
exports.getAllInternships = async (req = null, res = null) => {
  try {
    let data = await InternshipRef.get();

    let internshipData = {};

    data.forEach(internship => {
      if (internship.data().Status === "Open for Applications") {
        internshipData[internship.id] = internship.data();
      }

    });
    if (res != null) {
      res.status(200).json({ success: true, message: 'Internship has been found', internshipData: internshipData });
    }
    return internshipData;

  } catch (error) {
    if (res != null) {
      res.status(500).json({ success: false, message: 'Error querying internships' });
    }
  }
}

/*compound/complex querying of internships based on a specific field(s), filtering technique(s), and target value(s) --> returns dictionary of internship IDs to their data
ALL parameters of query should be passed (Company, Category, Pay, Location). Empty values will be disregarded.

Please refer to the project structure document for the field, filter, and target restrictions
*/
exports.queryInternships = async (req, res = null) => {
  try {
    let queryDict = {};
    let paramList = cleanQuery(req.query);
    const keyNames = Object.keys(paramList);

    if (keyNames.length == 0) {
      queryDict = await this.getAllInternships();
    } else {
      queryDict = await filterHelper(InternshipRef, paramList);
    }

    if (res != null) {
      res.status(200).json({ success: true, message: 'Internships have been found', internshipData: queryDict });
    }
    return queryDict;

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error querying internships' });
  }
};

const cleanQuery = (query) => {
  let updatedQuery = query;
  const keyNames = Object.keys(updatedQuery);

  for (let i = 0; i < keyNames.length; i++) {
    let currKey = keyNames[i];
    let q = updatedQuery[currKey];
    if ((currKey == "Location" && q.length == 0) || (q == '')) {
      delete updatedQuery[currKey];
    }
  }

  Object.keys(updatedQuery).forEach((key) => {

    let tar = updatedQuery[key];
    let fil = "==";

    if (key == "Category") {
      fil = "=="
    }
    if (key == "Pay") {
      fil = ">=";
      tar = parseInt(tar);
    }

    updatedQuery[key] = {
      field: key,
      filter: fil,
      target: tar,
    };
  });
  return updatedQuery;
}

// find and return an internship dictionary that relates their ID to thier data
exports.getInternship = async (req, res) => {
  try {
    //MentorID
    //Get all Intenrships that relate to Mentor
    const userID = req.user.uid;

    const MentorInternships = await InternshipRef.where('MentorID', '==', userID).get();
    const internships = [];

    // Iterate over the documents in the snapshot
    MentorInternships.forEach(doc => {

      const data = doc.data();
      // Construct the internship object with relevant data
      if (data.Status === "Open for Applications") {
        const internship = {
          id: doc.id, // Document ID
          data: data,// Other fields...
        };
        internships.push(internship); // Push the internship object to the array
      }
    });

    res.status(200).json({ message: "Internships Found", internships: internships })


  } catch (error) {

    res.status(500).json({ success: false, message: 'Error when getting internship' });
  }
};


//deletes an internship based on their ID
// THIS CODE IS ESSENTIALLY USELESS NOW! TO ENSURE OUR DATA IS SECURE, WE HAVE COMMENTED THE deleteDocument() FUNCTION
exports.deleteInternship = async (req, res) => {
  try {
    const InternshipID = Object.keys(req.query)[0];


    const InternshipRef = db.collection(Constants.COLLECTION_INTERNSHIP);
    let internshipData = await getDocument(InternshipRef, InternshipID);

    let MentorDeletesInternship = true;
    updateInternshipData(InternshipID, InternshipRef, internshipData, MentorDeletesInternship);

    res.status(200).json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting internship' });
  }
};


const updateInternshipData = async (internshipID, InternshipRef, internshipData, MentorDeletesInternship) => {
  try {
    // gather and update internship information
    const internship = InternshipRef.doc(internshipID);
    let appCount = internshipData.ApplicationCounter + 1;
    let newStatus = internshipData.Status;
    let newDisplay = internshipData.Display;
    if (appCount >= internshipData.RefferalLimit || MentorDeletesInternship === true) {
      newStatus = Constants.INTERNSHIP_STATUS_CLOSED;
      newDisplay = false;
    }
    await internship.update(
      {
        ApplicationCounter: appCount,
        Status: newStatus,
        Display: newDisplay
      }
    );
  } catch (error) {
  }
};

const updateUserData = async (userID) => {
  try {
    // gather and update user information
    const user = UserRef.doc(userID);
    let userData = (await user.get()).data();
    await user.update(
      {
        MonthlyRefferalCount: userData.MonthlyRefferalCount - 1,
        TotalRefferalCount: userData.TotalRefferalCount + 1
      }
    );
  } catch (error) {
  }
};
