const Constants = require('./databaseConstant.js');

/*
All functions within this file are used internally by Internships, Mentors, and Users.js as helper functions
*/


//query all Collections based on a specific field, filtering technique, and target value --> returns dictionary of document ID to document data in json format (FirstName: John, LastName: Smith)
async function queryCollection(colRef, reqBody) {
    let field = reqBody.field;
    let filter = reqBody.filter;
    let target = reqBody.target;

    let q = await colRef.where(field, filter, target).get();

    const queryDict = {}
    if (!(q.empty)) {
        q.forEach(doc => {
            queryDict[doc.id] = doc.data();
        });
    }
    return queryDict;
}

//de-dupes two dictionaries
async function deDupeQueries(fullDict, newDict) {
    for (const internshipID in fullDict) {
        if (!newDict.hasOwnProperty(internshipID)) {
            delete fullDict[internshipID];
        }
    }
    return fullDict;
};

async function filterHelper(colRef, paramList) {

    let queryDict = {};
    const keyNames = Object.keys(paramList);


    queryDict = await queryCollection(colRef, paramList[keyNames[0]]);
    for (let i = 1; i < keyNames.length; i++) {
        const currKey = keyNames[i]
        const query = paramList[currKey];
        let q = await queryCollection(colRef, query);
        queryDict = deDupeQueries(queryDict, q);
    }


    return queryDict;
}

//delete a document within a collection --> takes document ID
async function deleteDocument(colRef, docID) {

    const result = await colRef.doc(docID).delete();
    return result;
}

//find a document within a collection --> takes docuent ID and returns dictionary of document ID to document data in json format (FirstName: John, LastName: Smith)
async function getDocument(colRef, docID) {
    const doc = await colRef.doc(docID).get();

    if (!doc.exists) {
        return null;
    } else {
        let data = await doc.data()
        return data;
    }
}

module.exports = {
    queryCollection, deleteDocument, getDocument, deDupeQueries, filterHelper
};