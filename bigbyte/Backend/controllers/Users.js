const { uploadBytes, ref, deleteObject, getDownloadURL, listAll } = require('firebase/storage');
const { db, storage } = require('../FireBaseSetUp.js');
const Constants = require('./databaseConstant.js');
const { queryCollection, getDocument } = require('./databaseFunctions.js');

// create and initialize a database reference to the "Internship" collection
const UserRef = db.collection(Constants.COLLECTION_USERS);

const MentorNotificationsRef = db.collection(Constants.COLLECTION_MENTORS_NOTIFICATIONS);
//add a User --> takes userData in json format (FirstName: John, LastName: Smith)
exports.addUser = async (data, res = null) => {
    try {
        const userID = data.uid;
        await UserRef.doc(userID).set(data);

        //res.status(200).json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.log("There was some error when adding user", error);
        //res.status(500).json({ success: false, message: 'Error adding user' });
    }
}

//query all users based on a specific field, filtering technique, and target value --> returns dictionary of mentor ID to their data
exports.queryUsers = async (req, res) => {
    try {

        queryDict = await queryCollection(UserRef, req.body);

        res.status(200).json({ success: true, message: 'Users have been found' });
        return queryDict;

    } catch (error) {
        console.log("RAN INTO PROBLEM QUERYING USERS", error);
        res.status(500).json({ success: false, message: 'Error querying users' });
    }
};

//deletes a user based on their ID
// THIS CODE IS ESSENTIALLY USELESS NOW! TO ENSURE OUR DATA IS SECURE, WE HAVE COMMENTED THE deleteDocument() FUNCTION
exports.deleteUser = async (req, res) => {
    try {
        let userID = req.body.id;

        //const result = await deleteDocument(UserRef, userID);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log("There was some error when deleting user", error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        let userID = req.user.uid;
        let user = await getDocument(UserRef, userID);

        res.status(200).json({ success: true, userData: user });

    } catch (error) {
        console.log("RAN INTO PROBLEM LOOKING FOR USER", error);
        res.status(500).json({ success: false, message: 'Error when getting user' });
    }
}

// find and return an user dictionary that relates their ID to their data --> used by front end
exports.getUser = async (req, res, next) => {

    try {
        let userID = req.user.uid;

        let user;
        const doc = await UserRef.doc(userID).get();

        if (!doc.exists) {
            res.status(500).json({ success: false, message: 'Error when getting user' });
            return;
        } else {

            user = doc.data();
            delete user.uid; //removes the uid form data

        }


        req.userData = user;
        next();
        //pass on to getResume

    }
    catch {
        return res.status(500).json({ success: false, message: 'Error when getting user' });
    }


};

exports.getUserAndResume = async (req, res, next) => {

    let userID = req.user.uid;

    let pathName = Constants.STORAGE_RESUME + userID;
    const resumeRef = ref(storage, pathName);
    let URL
    try {
        URL = await getDownloadURL(resumeRef);
    }
    catch {
        return res.status(500).json({ message: " Upload a resume first before requesting a referal", resume: false });

    }
    //const user = await getDocument(UserRef, userID); cant use this because dont want to send USer UID back, secuirty hazard
    let user;
    const doc = await UserRef.doc(userID).get();

    if (!doc.exists) {
        res.status(500).json({ success: false, message: 'Error when getting user' });
        return;
    } else {

        user = doc.data();
        const userData = {
            Major: user.Major,
            Year: user.Year,
            Organizations: user.Organizations,
            Bio: user.Bio,
            Resume: URL,
            userID: userID
        };
        req.student = userData;
        // req.UserResume = URL;
        next();
    }
    //res.status(200).json({ success: true, user: user });

};

//update specific mentor with new data
exports.updateUser = async (req, res) => {

    try {
        let userID = req.user.uid;
        const userUpdate = req.body;
        await UserRef.doc(userID).update(userUpdate);
        let user = await getDocument(UserRef, userID);

        res.json({ success: true, message: 'User updated successfully', userData: user });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'User NOT updated (error)' });

    }
}

/*
apply to an internship --> relates user ID to internship ID, mentor ID, and internship company
creates a new document in the User->InternshipApp(UID->IID,MID,Company) collection
when displaying this application, including the internship status may be useful --> can be done by dynamically searching for the internship and pulling its status

req.body only contains userID and internshipID
*/
exports.applyForInternship = async (req, res) => {
    try {
        // gather user information
        const appRef = db.collection(Constants.COLLECTION_RELATIONAL_APPLICATIONS);
        let userID = req.body.userID;

        // gather internship information
        let internshipID = req.body.internshipID;
        const InternshipRef = db.collection(Constants.COLLECTION_INTERNSHIP);
        let internshipData = await getDocument(InternshipRef, internshipID);
        internshipData = internshipData[internshipID];

        // create and post application data
        const appData = {
            UserID: userID,
            InternshipID: internshipID,
            MentorID: internshipData.MentorID,
            InternshipCompany: internshipData.Company
        }
        await appRef.add(appData);

        // update user and internship data post application
        updateUserData(userID);
        updateInternshipData(internshipID, InternshipRef, internshipData);

        res.status(200).json({ success: true, message: 'User has applied successfully' });
    } catch (error) {
        console.log("There was some error when applying to the internship", error);
        res.status(500).json({ success: false, message: 'Error applying to internship' });
    }
};

// these are  internal funcitons to update User and Internship data
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
        console.log("There was some error when updating user data", error);
    }
};
const updateInternshipData = async (internshipID, InternshipRef, internshipData) => {
    try {
        // gather and update internship information
        const internship = InternshipRef.doc(internshipID);
        let appCount = internshipData.ApplicationCounter + 1;
        let newStatus = internshipData.Status;
        let newDisplay = internshipData.Display;
        if (appCount >= internshipData.RefferalLimit) {
            newStatus = Constants.INTERNSHIP_STATUS_REVIEW;
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
        console.log("There was some error when updating internship data", error);
    }
};

exports.CheckReferalStatus = async (req, res) => {
    try {
        const studentID = req.user.uid;
        const userNotificationsSnapshot = await MentorNotificationsRef.where('studentID', '==', studentID).get();

        if (userNotificationsSnapshot.empty) {
            return res.status(200).json({ message: "currently no request made" });
        }

        // Array to store notifications
        const notifications = [];

        userNotificationsSnapshot.forEach(doc => {
            const data = doc.data();
            const notificationData = {
                InternshipTitle: data.InternshipTitle,
                Company: data.company,
                status: data.status,
                // Add more fields as needed
            };
            notifications.push(notificationData);
        });


        res.status(200).json({ success: true, notifications: notifications });
    }
    catch (error) {
        console.error('Error fetching mentor notifications:', error);
        res.status(500).json({ success: false, message: 'Error fetching mentor notifications' });
    }
};

/*
below are functions for users to upload, delete, and view their resumes 
*/

/* 
function for a user to upload a resume
req must contain the following:
- resume file that is stored in req.files.Resume.data (file must be renamed to "Resume")
- userID that contains the user's unique ID which will serve as the resume's internal file name
*/
exports.uploadResume = async (req, res) => {
    try {
        let pathName = Constants.STORAGE_RESUME + req.body.userID;
        const resumeRef = ref(storage, pathName);
        const metadata = {
            contentType: "application/pdf"
        };
        await uploadBytes(resumeRef, req.files.Resume.data, metadata);
        res.status(200).json({ success: true, message: 'Succes when getting resume' });
    } catch (error) {
        console.log("an error happened:");
        console.log(error);
        res.status(500).json({ success: false, message: 'Error posting resume' });

    }
}

/* 
function for a user to delete their resume
req must contain the following:
- userID that contains the user's unique ID
*/
exports.deleteResume = async (req, res) => {
    try {
        let pathName = Constants.STORAGE_RESUME + req.body.userID;
        const resumeRef = ref(storage, pathName);

        await deleteObject(resumeRef);

        res.status(200).json({ success: true, message: 'Succes when deleting resume' });
    } catch (error) {
        console.log("an error happened:");
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting resume' });
    }
}
