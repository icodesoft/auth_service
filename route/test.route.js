const express = require('express')

const testRouter = express.Router()


testRouter.route("/test")
/**
 * Get a test entity
 * 
 * @route GET /test
 * @group Test - Operations about test
 * @param {integer} id.path.required
 * @returns {object} 200 - A test info
 * @returns {Error} default - Unexpected error
 * @security JWT
 */
.get((req, res) => {
    console.log("token: ", req.auth);
    res.json({"message":"i am get."})
})
.post((req, res) => {
    res.json({"message":"i am get."})
})


module.exports = testRouter