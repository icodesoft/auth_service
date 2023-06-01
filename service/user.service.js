const jwtUtil = require('../util/jwt.util');
const rsaUtil = require('../util/rsa.util');
const { User, sequelize } = require('../model/user.model');
const { Op, QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs')

const request = require('request');
const { NotFoundError, InvalidParameterError, ApplicationError } = require('../exceptions/error');

exports.register = async (req, res) => {
    const { username, password, nickname, email, user_pic } = req.body
    let user = await User.findOne({
        where: {
            username: {
                [Op.eq]: username
            }
        }
    });

    if (!user) {
        let newPassword = bcrypt.hashSync(password, 10);
        let dbUser = User.build({ username, newPassword, age: 22, email, fullName: 'Gary Gao', sex: 1, companyName: 'icodesoft' });
        console.log(JSON.stringify(dbUser, null, 2))
        // await dbUser.save();
    }



    res.json(dbUser)
}

exports.login = (req, res) => {
    const { username, password } = req.body

    // 从数据库查询用户是否存在

    // 对比数据库中的用户密码与登录用户密码

    // 如果对比成功则生成token并存入缓存，否则设置缓存中的token失效，抛出异常
    let token = jwtUtil.createToken({ grant_type: "password", provider: "icodesoft", username })

    let TokenResponse = {
        access_type: 'Bearer',
        access_token: token,
        expires_in: 30 * 60, // 1800s
        refresh_token: '' //String refreshToken = RandomStringUtils.random(64, true, true);
    }

    let date = new Date()

    let Session = {
        userId: 1,
        refreshToken: '',
        active: true,
        created: date,
        expires: date
    }
    // token 存入缓存


    res.json(token)
}

exports.authorize = (req, res) => {
    let { response_type, client_id, redirect_uri, state } = req.query;
    if (response_type != 'code') {
        throw new InvalidParameterError(response_type + "is not supported");
    }
}

exports.getUserById = async (req, res) => {
    // if (req.params.id > 3) {
    //     throw new NotFoundError('User is not exist');
    // }
    // let user = { "id": req.params.id, "name": "ggary", "email": "gary@outlook.com" }
    // let user = await sequelize.query(`SELECT * FROM user WHERE ID=${req.params.id}`, {type: QueryTypes.SELECT});
    let user;

    /**
     * Unmanaged transaction:
     */
    // const t = await sequelize.transaction();
    // t.afterCommit(async () => {
    //     user = await sequelize.query(`SELECT * FROM user WHERE ID=:id`, { replacements: { id: req.params.id * 1 }, type: QueryTypes.SELECT });
    // })
    // try {
    //     const [results, metadata] = await sequelize.query(`UPDATE user SET age = 1;`, { transaction: t });
    //     console.log(results, metadata);

    //     const [results2, metadata2] = await sequelize.query(`UPDATE user SET age = 10 WHERE id = :id;`, { replacements: { id: req.params.id * 1 }, transaction: t });
    //     console.log(results2, metadata2);
    //     if (req.params.id == 1) {
    //         throw new ApplicationError('Test transaction function', 500);
    //     }
    //     await t.commit();
    // } catch (e) {
    //     console.log(e);
    //     await t.rollback();
    // }

    /**
     * Managed transaction:
     */
    await sequelize.transaction(async (t) => {
        t.afterCommit( async () => {
            user = await sequelize.query(`SELECT * FROM user WHERE ID=:id`, { replacements: { id: req.params.id * 1 }, type: QueryTypes.SELECT });
        });

        const [results, metadata] = await sequelize.query(`UPDATE user SET age = 6;`);
        console.log(results, metadata);

        const [results2, metadata2] = await sequelize.query(`UPDATE user SET age = 'fdgdsfdafdgdgdfgs' WHERE id = :id;`, { replacements: { id: req.params.id * 1 } });
        console.log(results2, metadata2);
    }).catch(e => {
        console.log(e);
    });

    res.json(user, 'ok');
}

exports.getUserByName = (req, res) => {
    let user = { "id": 1, "name": req.query.name, "email": "gary@outlook.com" }
    res.json(user)
}

exports.getPublicKey = (req, res) => {
    res.json(rsaUtil.getPublicKey())
}

exports.testerror = async (req, res) => {
    console.log("this: ", this);
    let testPromise = test(req, res, "https://baidu.com")
    let headers;
    headers = await testPromise;
    console.log("cookie: ", headers);
    let raw_cookies = headers['FSDFSFSS'];
    raw_cookies.push('123')
    let cookieHeader = []
    raw_cookies.forEach(cookie => {
        console.log("cookie: ", cookie);
    })

    res.status(200).send(cookieHeader);
}

function test(req, res, url) {
    const options = {
        'method': 'GET',
        'url': url
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error);
            } else {
                try {
                    let raw_cookies = response.headers['FSDFSFSS'];
                    let cookieHeader = []
                    raw_cookies.forEach(cookie => {
                        console.log("cookie: ", cookie);
                    })
                } catch (e) {
                    e.statusCode = 401;
                    console.log('promise error: ', e);
                    reject(e);
                }

                resolve(response.headers);
            }
        })
    })
}