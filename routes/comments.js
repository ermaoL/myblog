const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const commentModel = require('../models/comments')

// POST /comments 创建一条留言
router.post('/', checkLogin, function(req, res, next) {
  const author = req.session.user._id
  const postId = req.fields.postId
  const content = req.fields.content

  // 校验参数
  try {
    if (!content.length) {
      throw new Error('请填写留言内容')
    }
  } catch(e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  const comment = {
    author: author,
    postId: postId,
    content: content
  }
  commentModel.create(comment).then(function() {
    req.flash('success', '留言成功')
    // 留言成功后跳转到上一页
    res.redirect('back')
  }).catch(next)
})

// GET /comments/:commentId/remove 删除一篇文章
router.get('/:commentId/remove', checkLogin, function(req, res, next) {
  const commentId = req.params.commentId
  const author = req.session.user._id
  commentModel.getCommentById(commentId).then(function(comment) {
    if (!comment) {
      throw new Error('没有权限删除留言')
    }
    commentModel.delCommentById(commentId).then(function() {
      req.flash('success', '删除留言成功')
      // 删除成功后跳转到上一页
      res.redirect('back')
    })
  })
})

module.exports = router