const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect("mongodb://localhost:27017/MoviesDB")
    .then(() => console.log("data connect successfully"))
    .catch((err) => console.log("there was an error", err))

const app = express()

app.use(express.json()) // when request comes it will be parsed by the express into json and when we send a response this will also convert it into string 
app.use(cors()) // will handle the cors for our request and responses 

// schema for movies
const movieSchema = new mongoose.Schema({

    moviename: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releasedate: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model  for schema
const movieModel = new mongoose.model('Movies', movieSchema)


app.get('/',(req,res)=>{
    movieModel.find()
    .then((data)=>{

        // console.log(data)
        res.send(data)
    })
    .catch((err) => console.log("there was an error", err))

})


app.listen(8000)

