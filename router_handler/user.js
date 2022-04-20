/**
 * 定义和用户相关的路由处理函数，供 /router/user.js 路由文件调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入加密模块
const bcrypt = require('bcryptjs')

// 注册用户处理函数
exports.regUser = (req, res) => {
  const userInfo = req.body
  // if(!userInfo.username || !userInfo.password) {
  //   // return res.send({status: 1, message: '用户名或密码不能为空！'})
  //   return res.cc('用户名或密码不能为空！')
  // }
  // 定义SQL语句，查询用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userInfo.username, (err, result) => {
    // 执行SQL语句失败
    if(err) return res.cc(err.message)
    // 判断是否存在
    if(result.length > 0) return res.cc('用户名已被占用')
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
  res.send('login ok2')
}
