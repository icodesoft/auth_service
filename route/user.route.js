const express = require('express')

const userRouter = express.Router()

const userService = require('../service/user.service')
/**
 * @typedef User
 * @property {string} username.required - user name
 * @property {string} password.required - user password
 * @property {string} nickname - user nick name
 * @property {string} email - user email
 * @property {string} user_pic - user pic
 */


userRouter.use((req, res, next) => {
    console.log("I am router middleware.")
    next()
})

/**
 * User register
 * 
 * @route POST /user/register
 * @group User - Operations about user
 * @param {User.model} User.body.required
 * @produces application/json
 * @consumes application/json
 * @returns {object} 200 - A user info
 * @returns {Error} default - Unexpected error
 * 
 */
userRouter.post('/user/register', userService.register)

/**
 * @typedef LoginUser
 * @property {string} username.required - user name
 * @property {string} password.required - user password
 */

/**
 * User login
 * 
 * @route POST /user/login
 * @group User - Operations about user
 * @param {LoginUser.model} User.body.required
 * @returns {object} 200 - A user info
 * @returns {Error} default - Unexpected error
 * 
 */
userRouter.post('/user/login', userService.login)

userRouter.post('/user/authorize', userService.authorize)

/**
 * Get a user entity by id
 * 
 * @route GET /user/{id}
 * @group User - Operations about user
 * @param {integer} id.path.required
 * @returns {object} 200 - A user info
 * @returns {Error} default - Unexpected error
 * 
 */
//@security basic JWT
userRouter.get('/user/:id', userService.getUserById)

/**
 * Get a user entity by name
 * 
 * @route GET /user
 * @group User - Operations about user
 * @param {string} name.query.required
 * @returns {object} 200 - A user info
 * @returns {Error} default - Unexpected error
 * 
 */
//@security basic JWT
userRouter.get('/user', userService.getUserByName)


/**
 * Get a PublicKey
 * 
 * @route GET /auth/v1/public_key
 * @group Token - Operations about publicKey
 * @returns {object} 200 - PublicKey
 * @returns {Error} default - Unexpected error
 * @security JWT
 */
userRouter.get('/auth/v1/public_key', userService.getPublicKey)



userRouter.get('/testerror', userService.testerror)

module.exports = userRouter