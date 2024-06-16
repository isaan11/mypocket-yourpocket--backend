const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(email,savingName, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection(`${email}`);
  return predictCollection.doc(savingName).set(data);
}
 
module.exports = storeData;