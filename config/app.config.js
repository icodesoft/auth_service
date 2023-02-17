

console.log("current ENV: ", process.env.currentEnv)
server = {
    host: process.env.host,
    port: process.env.port
}
db = {
    database: process.env.db_name,
    host: process.env.db_host,
    port: process.env.db_port,
    username: process.env.db_username,
    password: process.env.db_password,
    pool: {
        max: 5,
        min: 1,
        idle: 30000
    }
}

redis = {
    host: 'localhost',
    port: 5607,
    username: 'root',
    password: '123456'
}

module.exports =  { server, db, redis }