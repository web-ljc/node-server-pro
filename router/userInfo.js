const express = require('express')
const router = express.Router()

// 导入验证表单中间件和规则
const expressJoi = require('@escook/express-joi')
const {update_userinfo_schame, update_password_schame, update_avatar_schame} = require('../schema/user')

const userInfo_handler = require('../router_handler/userInfo')

router.get('/userInfo', userInfo_handler.getUseInfo)
router.post('/userInfo', expressJoi(update_userinfo_schame), userInfo_handler.updateUserInfo)
router.post('/updatepwd', expressJoi(update_password_schame), userInfo_handler.updatePassword)
router.post('/update/avatar', expressJoi(update_avatar_schame), userInfo_handler.updateAvatar)

module.exports = router