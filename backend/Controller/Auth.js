const bcrypt = require('bcrypt');
const User = require("../Models/User");
const jwt = require("jsonwebtoken")

require("dotenv").config()

// Sign up route handler
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password, role } = req.body;
        
        // check if user already exist 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create Entry for User
        let user = await User.create({
            name, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            })
        }

        // check for registered user 
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        if (await bcrypt.compare(password, user.password)) {
            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: "Login successful"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success: false,
                message: "Password is incorrect",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Login failed"
        })
    }
};

exports.GetMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user,
            message: "Profile fetched successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//For Admin - get all Students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'Student' }).select('-password');
        res.status(200).json({
            success: true,
            data: students,
            message: "Students fetched successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}