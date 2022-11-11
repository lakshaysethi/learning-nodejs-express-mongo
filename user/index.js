const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json()) 
app.use(cors())

mongoose.connect("mongodb+srv://admin:test@cluster0.ycautsx.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("database connection successful")
})
.catch(()=>{
    console.log("could not connect ")
})

//user scheme

const userScheme = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const userModel = new mongoose.model('users',userScheme)


app.get('/getUser',(req,res)=>{
    userModel.find()
    .then((data)=>res.send(data))
    .catch((error)=>res.send(error))

})

app.post('/createUser',(req,res)=>{
    let user_data = req.body
    console.log(user_data)
    bcryptjs.genSalt( 10,(err,salt)=>{
        if(err === null){
          bcryptjs.hash(user_data.password,salt,(err,newPassword)=>{
            user_data.password = newPassword;
            let user_abc = new userModel(user_data)
            user_abc.save()
            .then(()=>res.send({message:"user created"}))
            .catch((error)=>res.send({message:"Error occured "+ error}))

          })
        }
    }  )

})


app.post('/login',(req,res)=>{

    let {username, password} = req.body
    userModel.findOne({username:username})
    .then((user)=>{
        if(user !== null){
            bcryptjs.compare(password,user.password,(err,status)=>{
                if (status){
                    jwt.sign(username,"netflix",(err,token)=>{
                        if (err===null){
                            res.send({message:"login successful",token:token})
                        }else{
                            res.send({error:err})
                        }
                    })
                }else{
                    res.send({message:"bad password, please try again"})
                }
            })
        }else{

        }
    })
    .catch((err)=>res.send({message:"User not found"}) )
})







app.put('/updateUser/:id',(req,res)=>{
    let user_id = req.params.id
    let newdata = req.body
    userModel.updateOne({_id:user_id},newdata)
    .then(()=>res.send({message:"user updated"}))
    .catch((err)=>res.send({message:err}))
})

app.delete('/deleteUser/:id',(req,res)=>{
    let user_id = req.params.id
    userModel.deleteOne({_id:user_id})
    .then(()=>res.send({message:"user deleted"}))
    .catch((err)=>res.send({message:err}))
})


function tokenVerification( req,res,next ) {
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,"netflix",(err, userCred)=>{
            if (err===null){
                next()
            }else{
                res.send({message:"token invalid"})
            }
        })
    }else{
        res.send({message:"please authenticate your request"})
    }
}

app.get('/test',tokenVerification,(req,res)=>{
    res.send({message:"hello :)"})
})


app.listen(8000)



// {
//     "username":"lakshay345",
//     "email":"lakshay@hsdkjfh.com",
//     "password":"sdfgfhgjgf"
// }
// eyJhbGciOiJIUzI1NiJ9.bGFrc2hheTM0NQ.1W6VHubjYfYNqzRj6mFuSCQOM5uFpMR42FvkcKTX6cg