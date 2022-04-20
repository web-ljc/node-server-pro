const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证规则对象
const { reg_login_schame } = require('../schema/user')

// 注册新用户
// 3.在注册新用户时，生命局部中间件，对当前请求中携带的数据进行验证
// 3.1数据验证通过，会把这次请求流转给后面的路由处理函数
// 3.2数据验证失败，终止后续代码的执行，并抛出一个全局的Error错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressJoi(reg_login_schame), userHandler.regUser)
// 登录
router.post('/login', expressJoi(reg_login_schame), userHandler.login)

module.exports = router