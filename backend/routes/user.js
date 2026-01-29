const express = require('express')
const router = express.Router();

const { login, signup } = require("../Controller/Auth");
const { auth, isAdmin, isStudent } = require("../middleware/auth");
const {GetMyProfile , getAllStudents}=require('../Controller/Auth')

router.post("/signup", signup);
router.post("/login", login);

// Testing Route for Middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success: true,
        message: "Test successful"
    })
});
// Student to get Own Profile
router.get('/getProfile',auth,isStudent,GetMyProfile);

// Protected Route for Student
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Student"
    })
});

//Admin to get All Students
router.get('/getAllStudents',auth,isAdmin,getAllStudents)

// Protected Route for Admin 
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Admin"
    })
});

module.exports = router;