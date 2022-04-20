/**
 * 定义和用户相关的路由处理函数，供 /router/user.js 路由文件调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入加密模块
const bcrypt = require('bcryptjs')

// 导入jwt模块
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册用户处理函数
exports.regUser = (req, res) => {
  const userInfo = req.body
  // if(!userInfo.username || !userInfo.password) {
  //   // return res.send({status: 1, message: '用户名或密码不能为空！'})
  //   return res.cc('用户名或密码不能为空！')
  // }
  // 定义SQL语句，查询用户名是否被占用
  const sql = 'select * from ev_users where username=?'
  db.query(sql, userInfo.username, (err, results) => {
    // 执行SQL语句失败
    if(err) return res.cc(err.message)
    // 判断是否存在
    if(results.length > 0) return res.cc('用户名已被占用')
    // bcrypt.hashSync() 对用户密码加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    const sql = 'insert into ev_users set ?'
    db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results) => {
      // 执行SQL语句失败
      if(err) return res.cc(err.message)
      // SQL语句执行成功，但影响行数不为1
      if(results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      res.cc('注册成功！', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body
  const sql = `select * from ev_users where username=?`
  // 根据用户名查询用户信息
  db.query(sql, userInfo.username, (err, results) => {
    if(err) return res.cc(err.message)
    if(results.length !== 1) return res.cc('登录失败！')
    // 拿用户输入的密码和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    if(!compareResult) return res.cc('登录失败！')
    // 登录成功，生成 Token 字符串
    const user = { ...results[0], password: '', user_pic: ''}
    // 生成 Token 字符串，有效期10h，在登录时将用户信息保存在了token
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer '+tokenStr
    })
  })
}
