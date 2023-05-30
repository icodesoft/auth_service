# Auth Service

# 初始化

## 创建项目

- 新建auth-service文件夹，运行如下命令

  > npm init -y

- 运行如下的命令，安装特定版本的

 > npm i express@4.18.1

- 在项目根目录中新建 `index.js` 作为整个项目的入口文件，并初始化如下的代码

  ```js
  // 导入 express 模块
  const express = require('express')
  // 创建 express 的服务器实例
  const app = express()
  
  // 调用 app.listen 方法，指定端口号并启动web服务器
  app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
  })
  ```

## 配置 CORS

```js
const cors = require('cors')
app.use(cors())
```

## 解析Request body

```js
// 支持 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse requests of content-type - application/json
app.use(express.json());
```

## 重写res.json方法

```JS
app.use(function (req, res, next) {
  let json = res.json;
  res.json = function (data, message = 'success', status = 200) {
    json.call(this, { data, message}, status);
  }
  next()
})
```

## 配置全局异常处理

```JS
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(new Date().toLocaleString(), req.originalUrl, statusCode, err.message);
    console.error(err.stack);
    return res.json(undefined, err.message, statusCode);
});
```

## 配置swagger

```JS
const app = express();
const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3001',
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
    files: ['./route/**/*.js'] //Path to the API handle folder
};
expressSwagger(options)

// app.listen()
```

- swagger的注解使用

  ```JS
  /**
   * @typedef User
   * @property {string} username.required - user name
   * @property {string} password.required - user password
   * @property {string} nickname - user nick name
   * @property {string} email - user email
   * @property {string} user_pic - user pic
   */
  
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
  ```

  

## 配置服务健康检查

```JS
app.get('/health', (req, res) => {
    res.json({"status": "UP"})
})
```

## 多环境配置

### 安装组件 dotenv

```shell
npm i dotenv
```

### 配置

```JS
const NODE_ENV = 'dev';//process.env.NODE_ENV
const dotenvFile = NODE_ENV? `.env.${NODE_ENV}` : '.env'
console.log('dotenvFile: ' + dotenvFile)
require('dotenv').config({path: dotenvFile})
```

- 新建环境文件夹environments，并创建文件env.config.js，代码如下

  ```js
  // 注意dotenv是从项目根目录开始查找文件与当前env.config.js文件所在路径无关
  // 所以dotenvFile是以'./environments/'开头，而不是'../environments/'
  
  module.exports = () => {
      const NODE_ENV = process.env.NODE_ENV; // 此处需要在服务运行环境中设置系统变量 “NODE_ENV”
      const dotenvFile = './environments/' + (NODE_ENV? `.env.${NODE_ENV}` : '.env')
      console.log('dotenvFile: ' + dotenvFile)
      require('dotenv').config({path: dotenvFile})
  }
  ```

  

- 在index.js文件中引入环境配置文件，注意引入的位置，建议放在文件开头

  ```js
  const express = require('express')
  require('./config/env.config')()
  ```

- 从环境文件获取配置的值，在文件夹config下新建文件app.config.js

  ```js
  
  console.log("current ENV: ", process.env.currentEnv)
  server = {
      host: process.env.host,
      port: process.env.port
  }
  db = {
      host: process.env.db_host,
      port: process.env.db_port,
      username: process.env.db_username,
      password: process.env.db_password
  }
  
  redis = {
      host: 'localhost',
      port: 5607,
      username: 'root',
      password: '123456'
  }
  
  module.exports =  { server, db, redis }
  ```

## 引入JWT token生成与验证
### 安装组件express-jwt and jsonwebtoken
```shell
npm i jsonwebtoken express-jwt node-rsa
```
### 配置与使用
```js
// ****************Create RSA Start*****************************
const NodeRSA = require('node-rsa');

const key = new NodeRSA({b: 2048});
let privateKey, publicKey

exports.init = () => {
    privateKey = key.exportKey('pkcs1-private');
    console.log("privateKey: " + privateKey);
    fs.writeFileSync('../rsa-prv.pem', privateKey);
    publicKey = key.exportKey('pkcs8-public');
    console.log("publicKey: " + publicKey);
    fs.writeFileSync('../rsa-pub.pem', publicKey);
}
// ****************Create RSA End******************************
```

- 创建RSA相关服务

  ```js
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
  ```

  

- 创建JWT相关服务

  ```js
  const jwt = require('jsonwebtoken')
  const rsaUtil = require('./rsa.util');
  
  // 创建token
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
  
  // 验证token合法性
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
  ```

  

- 在index.js文件中添加对JWT的认证

  ```js
  const rsaUtil = require('./rsa.util');
  
  // 默认解析结果会赋值在 req.auth，也可以通过 requestProperty 来修改：
  app.use(expressJWT({ secret: rsaUtil.getPublicKey(), algorithms: ["RS256"] }).unless({ path: ['/health', /^\/api\/user\//] }));
  
  // router配置
  ```

  

- 在user.service.js中添加生成token，当用户登录成功后

  ```js
  const jwtUtil = require('../util/jwt.util')
  
  exports.login = (req,res) => {
      const { username, password } = req.body
      let token = jwtUtil.createToken({ username })
      res.json(token)
  }
  ```

## ORM框架Sequelize

https://sequelize.org/docs/v6/core-concepts/model-basics/

- 安装 sequelize mysql2

  ```shell
  npm i sequelize mysql2
  ```

  

- 创建 sequelize 对象 sequelize.config.js

  ```js
  const { Sequelize } = require('sequelize');
  const { db } = require('./app.config')
  
  const sequelize = new Sequelize(db.database, db.username, db.password, {
    logging: console.log,
    host: db.host,
    port: db.port,
    dialect: 'mysql',
    pool: {
      max: db.pool.max,
      min: db.pool.min,
      idle: db.pool.idle
    },
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false // disable creation of createdAt, updatedAt for tables
    }
  });
  
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
  
  module.exports = { Sequelize, sequelize }
  ```

  

- 定义 User 模型(user.model.js)

  ```js
  const { DataTypes, Model } = require('sequelize');
  const { sequelize } =  require('../config/sequelize.config')
  
  class User extends Model {}
    
    User.init({
        id : {
          type: DataTypes.INTEGER,
          field: 'id',
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        username: {
          type: DataTypes.STRING,
          field: 'username',
          allowNull: false
        },
        fullName: {
          type: DataTypes.STRING,
          field: 'full_name',
          allowNull: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        age: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        sex: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        companyName: {
          type: DataTypes.STRING,
          field: 'company_name',
          allowNull: true
        },
        createDate: {
          type: DataTypes.DATE,
          field: 'create_date',
          defaultValue: DataTypes.NOW,
          allowNull: false
        },
        loginDate: {
          type: DataTypes.DATE,
          field: 'login_date',
          defaultValue: DataTypes.NOW,
          allowNull: false
        }
      },
      {
        sequelize: sequelize,
        // 数据库表名称
        tableName: 'user'
      }
    )
    
    module.exports = {User, sequelize}
  ```

  

- 简单使用

  ```js
  const { User } = require('../model/user.model');
  const { Op } = require('sequelize');
  
  exports.getUserByName = async (req, res) => {
      let user = await User.findOne({
          where: {
              username: {
                  [Op.eq]: req.params.username
              }
          }
      });
      
      res.json(user)
  }
  ```

  

-  UnhandledPromiseRejectionWarning 异常**express全局的错误处理并不能直接捕获，因为它是个 Promise 错误**

  *一种是自定义方法处理*

  ```
  const asyncHandler = fn => (req, res, next) =>
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next);
  
  router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  }));
  ```

  *还有一种直接用轮子（推荐）*

  先安装再修改index.js文件，如下

  > npm i express-async-errors

  ```
  const express = require('express')
  require('express-async-errors');
  
  // 全局异常处理
  app.use((err, req, res, next) => {
      let statusCode = err.statusCode || 500;
      if (err.name === "UnauthorizedError") {
          statusCode = 401;
  
          // return res.status(401).send("invalid token...");
      }
  
      console.error(new Date().toLocaleString(), req.originalUrl, statusCode, err.message, err.stack);
      return res.status(statusCode).json({ 'message': err.message });
  });
  
  app.listen(server.port, () => {
      console.log(`Auth server running at http://${server.host}:${server.port}`)
  })
  ```