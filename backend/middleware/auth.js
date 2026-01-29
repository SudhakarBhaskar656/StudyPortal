const jwt = require("jsonwebtoken")
require("dotenv").config();


// exports.auth = (req, res, next) => {
//     try {
//         const token = req.body.token;
//         // const token = req.cookies.token 

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "token missing"
//             })
//         }

//         // verify the token 
//         try {
//             const decode = jwt.verify(token , process.env.JWT_SECRET);

//             console.log(decode)

//             req.user = decode;
//         }
//         catch (e) {
//             return res.status(401).json({
//                 success: false,
//                 message: "token is invalid"
//             })
//         }

//         next();
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(401).json({
//             success: false,
//             message: "Something went wrong while verifying token"
//         })
//     }
// }
exports.auth = (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (
            req.cookies && req.cookies.token) {
            token = req.cookies.token
        }else if (req.body && req.body.token){
            token=req.body.token
        }
        if(!token){
            return res.status(401).json({success:false , message:'Token Missing'})
        }
        const decoded=jwt.verify(token , process.env.JWT_SECRET);
        req.user=decoded  //like {id , email , role}
        next();

    }catch(err){
        return res.status(500).json({success:false , message:'Token invalid or expired'})
    }
};

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for students you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Admins,you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}