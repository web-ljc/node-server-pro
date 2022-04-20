const express = require('express')
const router = express.Router()

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

// 获取文章分类列表
router.get('/cates', artcate_handler.getArticleCates)
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router