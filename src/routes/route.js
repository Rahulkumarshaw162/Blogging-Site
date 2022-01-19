const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middle = require("../middleware/loginmiddle")


//API's
router.post('/authors', authorController.createAuthor);
router.post('/login', authorController.login);
router.post('/blogs',middle.authenticate, blogController.createBlogs);
router.get('/getblogs', middle.authenticate, blogController.getBlogs);
router.put('/blogs/:blogId', middle.authenticate, blogController.updateBlog);
router.delete('/blogs/:blogId', middle.authenticate, blogController.checkdeletestatus);
router.delete('/deletedBlogs', middle.authenticate, blogController.deletebyparams);


module.exports = router;                                 