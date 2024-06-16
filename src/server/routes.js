const { savingPredictHandler, firebaseSignUpHandler, firebaseLogInHandler, HelloWorld, logOuthandler } = require('./handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: savingPredictHandler
  },
  {
    path: '/signup',
    method: 'POST',
    handler : firebaseSignUpHandler
  },
  {
    path: '/login',
    method: 'POST',
    handler: firebaseLogInHandler
  },
  {
    method: 'GET',
    path: `/logged/{email}`,
    handler: HelloWorld
  },
  {
    path: '/logout',
    method : 'POST',
    handler: logOuthandler
  }
];
 
module.exports = routes;