const express = require('express')
require('express-async-errors');
require('./config/env.config')()
const app = express();
const cors = require('cors')
const rsaUtil = require('./util/rsa.util');
const { server } = require('./config/app.config')

require('./config/swagger.config')(app)

// import JWT
const { expressjwt: expressJWT } = require("express-jwt");

// import user router
const userRouter = require('./route/user.route');
const testRouter = require('./route/test.route');
const { error_handle } = require('./middleware/error.middleware');

const resOkAndError = function (req, res, next) {
    console.log("I am global middleware.")
    res.ok = function (data, msg='ok', status = 200) {
      res.status(status).send({
        status,
        message: msg,
        data
      })
    }
  
    res.error = function (err, status = 500) {
      
      res.status(status).send({
        // 状态
        status,
        // 状态描述，判断 err 是 错误对象 还是 字符串
        message: err instanceof Error ? err.message : err,
      })
    }

    next()
}

// 解决跨域
// NOTE: 必须放在静态资源配置之后 
app.use(cors())

// 支持 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse requests of content-type - application/json
app.use(express.json());

// 默认解析结果会赋值在 req.auth，也可以通过 requestProperty 来修改：user\/
app.use(expressJWT({ secret: rsaUtil.getPublicKey(), algorithms: ["RS256"] }).unless({ path: ['/health', /^\/api\//] }));

// 注册全局中间件，扩展res两个新的功能ok 和 error.
app.use(resOkAndError);

app.use('/api', userRouter, testRouter)

app.get('/health', (req, res) => {
    res.json({ "status": "UP" })
})

// 全局异常处理
app.use(error_handle)
// app.use((err, req, res, next) => {
//     let statusCode = err.statusCode || 500;
//     if (err.name === "UnauthorizedError") {
//         statusCode = 401;

//         // return res.status(401).send("invalid token...");
//     }

//     console.error(new Date().toLocaleString(), req.originalUrl, statusCode, err.message, err.stack);
//     return res.status(statusCode).json({ 'message': err.message });
// });

app.listen(server.port, () => {
    console.log(`Auth server running at http://${server.host}:${server.port}`)
})
