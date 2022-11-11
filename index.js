const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect("mongodb+srv://admin:test@cluster0.ycautsx.mongodb.net/?retryWrites=true&w=majority")
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
const movieModel = new mongoose.model('movies', movieSchema)


app.get('/',(req,res)=>{
    movieModel.find()
    .then((data)=>{

        // console.log(data)
        res.send(data)
    })
    .catch((err) => console.log("there was an error", err))

})
// posi api 
app.post('/createmovie', (req,res)=>{
    let data_from_request = req.body;
    let new_movie = new movieModel(data_from_request)
    new_movie.save()
    .then(()=>{
        res.send( {
            message:"Movie created" + `${data_from_request}`
        } )
    })
    .catch((err)=>{
        res.send({
            message:"there was an error",
            error:err
        })
    })
    
})

// update
app.put('/updatemovie/:id',(req,res)=>{
    let object_id = req.params.id;
    let updated_data = req.body;
    movieModel.updateOne({_id:object_id},updated_data)
    .then(()=>{res.send({
        message:"updated successfully"
    })})
    .catch((err)=>{
        res.send({
            message:"there was an error",
            error: err
        })
    })
})

// delete
app.delete('/deletemovie/:id',(req,res)=>{
    let object_id = req.params.id;
    movieModel.deleteOne({_id:object_id})
    .then(()=>{
        res.send({
            message:"deleted successfully"
        })

    })
    .catch((err)=>{
        res.send({
            message: "there was error "+ err
        })
    })
})




app.listen(8000)

