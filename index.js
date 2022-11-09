const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


mongoose.connect("mongodb+srv://test:test@cluster0.53zblji.mongodb.net/test")
.then(()=>console.log("data connect successfully"))
.catch((err)=>console.log("htere was error",err))

