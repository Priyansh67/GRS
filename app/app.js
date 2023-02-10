const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv')
const ejs = require('ejs')
const controllers = require('../database/controllers')
const {auth} = require('./auth')

app.set('views',path.resolve(__dirname,'../assets','../assets'))
app.set('view engine','ejs')


//creating session 
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24}, //24 hours
    resave: true,
    saveUninitialized: false 
}));

app.use(express.json())
app.use(express.urlencoded({extended:true})) //parsing form data to access it in routes
app.use('/',express.static(path.resolve(__dirname,'../assets')))


//routes
app.get('/login',async (req,res)=>{
    res.sendFile(path.resolve(__dirname,'../assets','index.html'))
})
app.get('/newcomplaint',auth,async (req,res)=>{
    res.sendFile(path.resolve(__dirname,'../assets','newcomplaint.html'))
})
app.get('/dashboard',auth,async (req,res)=>{
    res.sendFile(path.resolve(__dirname,'../assets','dashboard.html'))
})



app.post('/login', async (req,res)=>{
    
    result = await controllers.login(req)
    if(result == true)
    {
        res.status(200).sendFile(path.resolve(__dirname,'../assets','dashboard.html'))
    }
    else{
        // res.status(401).sendFile(path.resolve(__dirname,'../assets','error.html'))
        res.render('error',{code :'401',errordesc: 'Unauthorised access' ,message:'Kindly provide valid credentials'})
    }
})

app.post('/signup',async (req,res)=>{
    result = await controllers.signup(req)
    if(result == true)
    {
        res.status(200).sendFile(path.resolve(__dirname,'../assets','index.html'))
    }
    else{
        console.log(result)
        res.render('error',{code :'500',errordesc: '' ,message:'Something Went Wrong'})
    }
})

app.post('/raiseComplaint',async (req,res)=>{
    result = await controllers.raiseComplaint(req)
    if(result == true)
    {
        res.send(`<h1>issue raised successfully</h1>`)
    }
    else{
        console.log(result)
        res.render('error',{code :'500',errordesc: '' ,message:'Something Went Wrong'})
    }
})

app.listen(4000,()=>{
    console.log("server listening on port 4000")
})

