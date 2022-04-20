// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 静态资源托管
app.use(express.static('./template'))
app.use('/uploads', express.static('./uploads'))

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件 解析application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件
app.use((req, res, next) => {
  // status = 0 为成功；status = 1 为失败，默认status的值为1
  res.cc = (err, status = 1) => {
    res.send({
      status, // 状态
      message: err instanceof Error ? err.message : err // 状态描述
    })
  }
  next()
})

// 导入配置文件
const config = require('./config')
// 解析 toke 的中间件
const expressJWT = require('express-jwt')
// 使用.unless({path:[]}) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms:['HS256'] }).unless({ path: [/^\/api\//] }))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
const userInfoRouter = require('./router/userInfo')
app.use('/my', userInfoRouter)
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 错误中间件
const joi = require('joi')
app.use((err, req, res, next) => {
  // 数据验证失败
  if(err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 其它错误
  res.cc(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3001, () => {
  console.info('api server running at http://127.0.0.1:3001')
})