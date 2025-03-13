const express = require('express')
const router = express.Router()
const { createPostController, getAllPostController, userPostsController } = require('../controllers/postController')
const { authenticateToken } = require('../controllers/userController')

router.get('/post', (req, res) => {
    return res.send('i am from post route')
})

router.post('/create-post',authenticateToken, createPostController)
router.get('/all-post', getAllPostController)
router.get('/user-post', authenticateToken ,userPostsController)


module.exports = router;