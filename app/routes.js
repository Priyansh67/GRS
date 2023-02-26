const express = require('express')
const path = require('path')
const controllers = require('../database/controllers')
const {auth} = require('./auth')

//creating routers
const index = express.Router()
const admin  = express.Router()
const student = express.Router()
const faculty = express.Router()
const util = express.Router()

var allcomplaint = []


//setting up routers with static files 
index.use(express.static(path.resolve(__dirname,'../assets')))
admin.use(express.static(path.resolve(__dirname,'../assets')))
student.use(express.static(path.resolve(__dirname,'../assets')))
faculty.use(express.static(path.resolve(__dirname,'../assets')))
util.use(express.static(path.resolve(__dirname,'../assets')))

//defining routes
index.get('/',(req,res)=>{
    //destroy session
    req.session.destroy()
    res.render('index',{message: ''})
})


/**********************************/
/**student routes */
/**********************************/
{
    student.get('/login',(req,res)=>{
        res.render('login',{message: ''})
    })

    student.post('/login',async (req,res)=>{
        result = await controllers.login(req,"student")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            if(allcomplaint == false)
            {
                allcomplaint = []
                res.render('dashboard',{message: 'Something went wrong', allComplaints: allcomplaint})
            }
            else if(allcomplaint == [])
            {
                res.render('dashboard',{message: 'No complaints found', allComplaints: allcomplaint})
            }
            else
            {
                res.render('dashboard',{message: '', allComplaints: allcomplaint})
            }
        }
        else{
            res.render('login',{message: 'Kindly provide valid credentials'})
        }
    })

    student.post('/signup',async (req,res)=>{
        result = await controllers.signup(req,"student")
        if(result == true)
        {
            res.render('login',{message: 'User created successfully'})
        }
        else{
            console.log(result)
            res.render('login',{message: 'Something went wrong!! Please try again'})
        }
    })


    student.get('/newcomplaint',auth,async (req,res)=>{
        res.render('newcomplaint' ,{message: ''})
    })

    student.post('/newcomplaint',auth,async (req,res)=>{
        
        result = await controllers.raiseComplaint(req).then((result)=>{return result}) //returns a promise
        console.log(result)
        if(result == true)
        {
            res.render('newcomplaint',{message: 'Issue raised successfully'})
        }
        else{
            console.log(result)
            res.render('newcomplaint',{message: 'Something went wrong!! Please try again'})
        }
    })

    student.get('/upvotes/:cid',auth,async (req,res)=>{
        await controllers.upvotes(req,req.params.id).then((result)=>{
            if(result == true)
            {
                res.render('dashboard',{message : 'Upvote added successfully' ,allComplaints:allcomplaint})
                
            }
            else{
                res.render('dashboard',{message : result ,allComplaints:allcomplaint})
            }
        })
    })

    student.get('/profile',auth,async (req,res)=>{
        res.render('studentProfile',{
            role : req.session.user.role,
            name: req.session.user.name , 
            email: req.session.user.username , 
            phone: req.session.user.phone , 
            rollno: req.session.user.enroll_no , 
            branch: req.session.user.branch , 
            course : req.session.user.course ,
            sem: req.session.user.semester})
        
    })

}


/**********************************/
/**faculty routes */
/**********************************/
{
    faculty.get('/login',(req,res)=>{
        res.render('facultyLogin',{message: ''})
    })

    faculty.post('/login',async (req,res)=>{
        result = await controllers.login(req,"faculty")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            res.render('facultydashboard',{message: '',allComplaints:allcomplaint})
        }
        else{
            res.render('facultyLogin',{message: 'Kindly provide valid credentials'})
        }
    })

    faculty.post('/signup',async (req,res)=>{
        result = await controllers.signup(req,"faculty")
        if(result == true)
        {
            res.render('facultyLogin',{message: 'User created successfully'})
        }
        else{
            console.log(result)
            res.render('facultyLogin',{message: 'Something went wrong!! Please try again'})
        }
    })


    faculty.get('/myprofile',auth,async (req,res)=>{
        res.render('FacultyProf',{
            role : req.session.user.role,
            name: req.session.user.name , 
            username: req.session.user.username , 
            phone: req.session.user.phone ,  
            dept: req.session.user.dept ,
            designation : req.session.user.designation,
            scores: req.session.user.scores
            })
        
    })

    faculty.get('/feedback',auth,async (req,res)=>{
        console.log("feedback form")
        res.send("feedback form")
    })


    faculty.get('/:cid',auth,async (req,res)=>{
        await controllers.getComplaint(req,req.params.id).then((result)=>{
            if(result == false)
            {
                res.render('facultydashboard',{message : 'Something went wrong' ,allComplaints:allcomplaint})
                
            }
            else{
                res.render('complaint-form',{message : '' ,complaint:result})
            }
        })
    })

    faculty.post('/:cid',auth,async (req,res)=>{
        await controllers.setstatus(req,req.params.id).then((result)=>{
            if(result == true)
            {
                res.render('facultydashboard',{message : 'Status Updated' ,allComplaints:allcomplaint})
                
            }
            else{
                res.render('facultydashboard',{message : result ,allComplaints:allcomplaint})
            }
        })
    })
}


/******************************** */
/**admin routes */
/******************************** */
{
    admin.get('/signup',(req,res)=>{
        res.render('adminSignup',{message: 'Enter your Details'})

    })
    admin.post('/signup',async (req,res)=>{
        result = await controllers.adminReg(req,"admin")
        if(result == true)
        {
            res.render('adminLogin',{message: 'User created successfully'})
        }
        else{
            console.log(result)
            res.render('adminLogin',{message: 'Something went wrong!! Please try again'})
        }
    })

    admin.get('/login',(req,res)=>{
        res.render('adminLogin',{message: ''})
    })


    admin.post('/login',async (req,res)=>{
        result = await controllers.login(req,"admin")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            res.render('admindashboard',{message: '',allComplaints:allcomplaint})
        }
        else{
            res.render('adminLogin',{message: 'Kindly provide valid credentials'})
        }
    })

    admin.get('/assign-fac',async (req,res)=>{
        res.render('assign-faculty',{message: ''})
        // res.send("assign faculty page")
    })

    admin.get('/deactivate-stu',auth,async (req,res)=>{
        // res.render('deactivate-student',{message: ''})
        res.send("deactivate student page")
    })
}

/**********************************/
/**common routes */
/**********************************/
{
    util.get('/',auth,async (req,res)=>{
        allcomplaint = await controllers.getAllComplaints()
        if(req.session.user.role=="student") file = 'dashboard'
        else if(req.session.user.role=="faculty") file = 'facultydashboard'
        else if(req.session.user.role=="admin") file = 'admindashboard'
        res.render(file,{message: '',allComplaints:allcomplaint})
    })

    util.get('/search',auth,async (req,res)=>{
        const srchquery = req.query.search
        var srchresult = []
        
        if(req.session.user.role=="student") file = 'dashboard'
        else if(req.session.user.role=="faculty") file = 'facultydashboard'
        else if(req.session.user.role=="admin") file = 'admindashboard'
    
        if(allcomplaint){
            srchresult = allcomplaint.filter((complaint)=>{
                return complaint.issue.toLowerCase().includes(srchquery.toLowerCase()) || complaint.status.toLowerCase().includes(srchquery.toLowerCase()) || complaint.dept_id.toLowerCase().includes(srchquery.toLowerCase()) || complaint.description.toLowerCase().includes(srchquery.toLowerCase())
            })
            if(srchresult == []){
                res.render(file,{message: 'No complaints found', allComplaints: srchresult})
            }
            else
                res.render(file,{message: '', allComplaints: srchresult})
        }
        else res.render(file,{message: 'No complaints', allComplaints: allcomplaint})
    
    })
    util.get('/allprofiles',auth,async (req,res)=>{
        var faculties = await controllers.getFaculties()
        res.render('faculties',{ faculties: faculties,role: req.session.user.role})
    })
}

module.exports = {
    student,
    util,
    faculty,
    index,
    admin
}