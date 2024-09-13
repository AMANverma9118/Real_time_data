const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
app.use(cors());

// require("dotenv").config();

const PORT = process.env.PORT||4000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json());


// app.use('/',appRoute);

app.get('/',(req,res)=>{
    res.send('Hello everyone, Your name');
})

app.listen(PORT, ()=>{
    console.log(`Server is runing on http://localhost:${PORT}`)
})

