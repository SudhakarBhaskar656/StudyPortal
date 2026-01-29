const express=require('express');
const router=express.Router();
const {buyCourse , getMyOrders , GetAllOrders}=require('../Controller/ordercontroller');
const { auth,isStudent, isAdmin } = require('../middleware/auth');

router.post('/buy',auth,isStudent,buyCourse);


router.get('/getMyOrder',auth,isStudent,getMyOrders); 


router.get('/getall',auth,isAdmin,GetAllOrders); //Admin can view all Orders


module.exports=router;


