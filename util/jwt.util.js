const jwt = require('jsonwebtoken')
const rsaUtil = require('./rsa.util');

module.exports.createToken = (user) => {
    let privateKey = rsaUtil.getPrivateKey()

    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, privateKey, {
        issuer: 'icodesoft.com',
        subject: user.username ? user.username : 'ggary',
        algorithm: 'RS256',
        expiresIn: '60s', // token 有效期为 10 小时
    });
    return tokenStr;
}

module.exports.verifyToken = (token) => {
    let result = null
    let publicKey = rsaUtil.getPublicKey()
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
        if (err) {
            throw err;
        } else {
            result = user;
        }
      })

      return result;
}

// nodejs利用string-random生成指定的随机字符串
function randomString(length) {
    var result = console.log(stringRandom(16, { numbers: true, letters: true, specials: "-" })); 
    return result;
}