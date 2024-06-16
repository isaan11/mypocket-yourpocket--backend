const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
// async function predictClassification(model, data) {
//     try {
//         const tensor = tf.node
    
//         const prediction = model.predict(tensor);
//         const score = await prediction.data();
//         const confidenceScore = Math.max(...score) * 100;
    
//         let label, suggestion;
    
//         return { confidenceScore, label, suggestion };
//     }
//     catch (error) {
//         throw new InputError();
//     }
    
// }

async function predictSavings(model, income, expense, saving) {
    try {
        const tensor = tf.tensor([income, expense, saving])
        const result = model.predict(tensor);
    
        return { result };
    }
    catch (error) {
        throw new InputError();
    }
    
}

module.exports = { predictSavings };