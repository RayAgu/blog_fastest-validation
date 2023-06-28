const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dk6v7uaq6', 
    api_key: '598792228178269', 
    api_secret: 'bxmj4cj5Z2H7mvrKVYfCrizvaq8' 
  });

module.exports = cloudinary;