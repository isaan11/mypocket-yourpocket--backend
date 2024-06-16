const predictSavings = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { input } = require('@tensorflow/tfjs-node');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const readData = require('../services/readData');

// async function postPredictHandler(request, h) {
//     const { input } = request.payload;
//     const { model } = request.server.app;

//     const { confidenceScore, label, suggestion } = await predictClassification(model, input);
//     const id = crypto.randomUUID();
//     const createdAt = new Date().toISOString();

//     const data = {
//         "id": id,
//         "result": label,
//         "suggestion": suggestion,
//         "confidenceScore": confidenceScore,
//         "createdAt": createdAt
//     }

//     await storeData(id, data);

//     const response = h.response({
//         status: 'success',
//         message: 'Model is predicted successfully',
//         data
//       })
//       response.code(201);
//       return response;

// }

async function savingPredictHandler(request, h) {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    const { userInput: {
        income, expense, saving, savingName
    } } = request.payload;
    const { model } = request.server.app;

    const { result } = await predictSavings(model, income, expense, saving);
    // const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "email": user.email,
        "savingName": savingName,
        "result": result,
        "createdAt": createdAt
    }

    await storeData(user.email, savingName, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;

}

async function historyHandler(request, h){
    const { savingName } = request.payload;
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    const data = await readData(user.email, savingName);

    const response = h.response({
        status: 'success',
        message: 'History Loaded',
        data
    })
    response.code(201);
    return response;
}

async function firebaseSignUpHandler(request, h) {
    const { email, password } = request.payload;
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        return error;
    }
}

async function firebaseLogInHandler(request, h) {
    const { email, password } = request.payload;
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return h.redirect(`/logged/${user.email}`);
    } catch (error) {
        return error;
    }
}

async function HelloWorld(request, h) {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    try {
        return `Hello, ${user.email}`;
    } catch (error) {
        return error;
    }
}

async function logOuthandler(request, h) {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    try {
        await signOut(auth);
        const response = h.response({
            status: 'success',
            message: 'Logged Out successfully'
        });
        return response;
    } catch (error) {
        return error;
    }
}

module.exports = { savingPredictHandler, firebaseSignUpHandler, firebaseLogInHandler, logOuthandler, HelloWorld };
