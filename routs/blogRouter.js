const express = require( 'express' );
const router = express.Router();
const upload = require( '../utils/multer' );
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog } = require( '../controllers/blogController' );
//const validateBlog = require('../middleware/hapiJoy')



router.post( '/create',  upload.single('image'), createBlog );
router.get( '/create', getBlogs );
router.get( '/create/:id', getBlog );
router.put( '/create/:id', upload.single('image'), updateBlog );
router.delete( '/create/:id', upload.single('image'), deleteBlog );

module.exports = router;