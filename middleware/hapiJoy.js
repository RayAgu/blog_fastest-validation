const Joi = require('@hapi/joi');

const validateBlog = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    title: Joi.string().required(),
    comment: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Handle validation error
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateBlog;

// validation 2
// const validateProfile = (data) => {
//     const schema = Joi.object({
//     title: Joi.string().required(),
//     image: Joi.string().pattern(/^[0-9]{10}$/).required(),
//     comment: Joi.string().required()
//     } );
    
//     return schema.validate( data );
// }

// module.exports.validateProfile = validateProfile;