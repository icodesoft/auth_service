module.exports = () => {
    const NODE_ENV = 'test';//process.env.NODE_ENV
    const dotenvFile = './environments/' + (NODE_ENV? `.env.${NODE_ENV}` : '.env')
    console.log('dotenvFile: ' + dotenvFile)
    require('dotenv').config({path: dotenvFile})
}