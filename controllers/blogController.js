const blogModel = require( '../models/blogModel' );
const cloudinary = require( '../utils/cloudinary' );
const fs = require( 'fs' );
//const validateProfile = require('../middleware/hapiJoy');
const validator = require('fastest-validator');
const { default: Validator } = require('fastest-validator');
//validator is a class, so you have to make it an object

const createBlog = async(req, res) =>{
    try{
        const { title, comment } = req.body
        const result = await cloudinary.uploader.upload(req.file.path)
        const newComment = Number(req.body.comment)
        const myblogModel = {
            title,
            comment: newComment,
            image: result.secure_url
        };
        const validateSchema = {
            title:{type: "string", optional: false, max: 8, min: 5},
            comment: {type: "string", optional: false},
            image: {type: "string", optional: false}
        }
        const v = new Validator()
        const validate = v.validate(myblogModel, validateSchema)

        const savedBlog = await blogModel.create( myblogModel )
        if(validate !== true){
            res.status(400).json({
                message: "error trying to validate",
                error: validate[0].message
            })
        } else {
            res.status(201).json({
                message: "blog created successfuly",
                data: savedBlog
            })
        }
    } catch (error){
        res.status(500).json({
            message: error.message
        })
    }
}


// //create new blog
// const createBlog = async ( req, res ) => {
//     try {
//         const {title, comment} = req.body

//         // upload image to cloudinary
//         const result = await cloudinary.uploader.upload( req.file.path )
        
//         // create profile
//         const blog = new blogModel( {
//             title,
//             image: result.secure_url,
//             comment, 
//         } )
        
//         // save the new profile
//         const newBlog = await blog.save();
//         console.log( newBlog );

//         // delete the image from the local directory
//         await fs.unlinkSync( req.file.path )
        
//         if ( newBlog ) {
//             console.log( newBlog );
//             res.status( 201 ).json( {
//                 message: "Blog created successfully",
//                 data: newBlog,
//             })
//         } else {
//             res.status( 400 ).json( {
//                 message: "Unable to create blog"
//             })
//         }

//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         })
//     }
// }




// // create new profile using error object from hapi/joi
// const createProfile = async ( req, res ) => {
//     try {
//         const { profileName, profilePhone } = req.body;

//         const { error } = validateProfile( req.body );
//         if ( error ) {
//             res.status( 409 ).json( {
//                 message: error.details[0].message
//             })
//         } else {
//             // upload image to cloudinary
//         const result = await cloudinary.uploader.upload( req.file.path )
        
//         // create profile
//         const profile = new profileModel( {
//             profileName,
//             profilePhone,
//             profileImage: result.secure_url,
//         } )
        
//         // save the new profile
//         const newProfile = await profile.save();
//         console.log( newProfile );

//         // delete the image from the local directory
//         await fs.unlinkSync( req.file.path )
        
//         if ( newProfile ) {
//             console.log( newProfile );
//             res.status( 201 ).json( {
//                 message: "Profile created successfully",
//                 data: newProfile,
//             })
//         } else {
//             res.status( 400 ).json( {
//                 message: "Unable to create profile"
//             })
//         }
//         }
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         })
//     }
// }

const getBlogs = async ( req, res ) => {
    try {
        const blogs = await blogModel.find();
        if ( blogs === null ) {
            res.status( 200 ).json( {
                message: "No blog found.",
                data: []
            })
        } else {
            res.status( 200 ).json( {
                data: blogs
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

// get a blog
const getBlog = async ( req, res ) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById( id );
        if ( !blog ) {
            res.status( 404 ).json( {
                message: `No blog with id ${id}`
            })
        } else {
            res.status( 200 ).json( {
                data: blog,
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

// update profile
const updateBlog = async ( req, res) => {
    try {
         const blog = await blogModel.findById(req.params.id);
    if (blog) {
      // Delete the existing image from local upload folder and Cloudinary
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      
      // Update the profile data in MongoDB
      blog.title = req.body.title;
      blog.image = result.secure_url;
      blog.comment = req.body.comment;
      await blog.save();
      // Delete file from local upload folder
      fs.unlinkSync(req.file.path);

      res.json({ message: 'blog updated successfully', data: blog });
    } else {
      res.status(404).json({ error: 'blog not found' });
    }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// delete profile 
const deleteBlog = async ( req, res ) => {
    try {
        const blog = await blogModel.findById(req.params.id);
    if (profile) {
      // Delete the image from local upload folder and Cloudinary
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete the blog from MongoDB
      await blogModel.findByIdAndDelete(req.params.id);

      res.json({ message: 'blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'blog not found' });
    }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
}