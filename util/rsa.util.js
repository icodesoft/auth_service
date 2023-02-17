// ****************Create RSA Start*****************************
// const NodeRSA = require('node-rsa');

// const key = new NodeRSA({b: 2048});
// let privateKey, publicKey

// exports.init = () => {
//     privateKey = key.exportKey('pkcs1-private');
//     console.log("privateKey: " + privateKey);
//     fs.writeFileSync('../rsa-prv.pem', privateKey);
//     publicKey = key.exportKey('pkcs8-public');
//     console.log("publicKey: " + publicKey);
//     fs.writeFileSync('../rsa-pub.pem', publicKey);
// }
// ****************Create RSA End******************************

const fs = require('fs');
const path = require('path');


exports.getPublicKey = () => {
    let filePath = path.join(__dirname, '../rsa-pub.pem');
    console.log("publicKey file path: " + filePath);
    return fs.readFileSync(filePath, 'utf8');
}

exports.getPrivateKey = () => {
    let filePath = path.join(__dirname, '../rsa-prv.pem');
    console.log("privateKey file path: " + filePath);
    return fs.readFileSync(filePath, 'utf8');
}