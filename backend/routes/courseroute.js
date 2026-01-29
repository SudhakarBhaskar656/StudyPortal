const express=require('express');
const router=express.Router();
const {createCourse , getAllCoursesForUser , getCourseById , UpdateCourse , DeleteCourse, getCourseImage, getMyCourses}=require('../Controller/coursecontroller');
const {auth , isAdmin , isStudent}=require('../middleware/auth');
const upload = require('../config/multer');

router.post('/create',auth,isAdmin,upload.single('image'),createCourse);
router.put('/update/:id',auth,isAdmin,UpdateCourse);
router.delete('/delete/:id',auth,isAdmin,DeleteCourse);
router.get('/image/:id',getCourseImage);
router.get('/my-courses',auth,getMyCourses);

router.get('/getAllCourses',getAllCoursesForUser);
router.get('/getcourse/:id',getCourseById);

module.exports=router;
