require( './config/blogDB' );
const express = require( 'express' );
const blogRouter = require('./routs/blogRouter')

PORT = 4090;
const app = express();
app.use( express.json() );
app.use( '/uploads', express.static( "uploads" ) )
app.use( '/api', blogRouter );

app.listen( PORT, () => {
    console.log(`listening to port: ${PORT}`)
})