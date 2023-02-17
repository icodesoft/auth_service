const { server } = require('./app.config')

module.exports = (app) => {
    const expressSwagger = require('express-swagger-generator')(app);

    let options = {
        swaggerDefinition: {
            info: {
                description: 'Auth server',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: `${server.host}:${server.port}`,
            basePath: '/api',
            produces: [
                "application/json"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        route: {
            url: '/swagger',
            docs: '/swagger.json' //swagger api
        },
        basedir: __dirname, //app absolute path
        files: ['../route/**/*.js'] //Path to the API handle folder
    };

    expressSwagger(options)
}


