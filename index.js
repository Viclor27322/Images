const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dleyjie7k",
    api_key: "369378637416463",
    api_secret: "SpzO0eWcQSDLriCXAARVfNTJdLQ"
  });
const ProdRoutes = require('./src/routesp');

const app = express();
const port = process.env.PORT || 9000;

//routes
app.get('/',(req,res)=>{
    res.send("Welcome to my Api")
})

app.use(cors());
app.use(express.json());
app.use('/api',ProdRoutes);

///conexion
mongoose.connect(
    process.env.MONGODB_URI
).then(()=>console.log('Conected to MongoDB'))
.catch((error)=>console.error(error));


app.listen(port,()=>console.log('Server listen on port ', port));