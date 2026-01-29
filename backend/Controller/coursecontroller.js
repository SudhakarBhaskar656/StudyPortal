const Course = require('../Models/courses');
const Order = require('../Models/orders');
const { getBucket } = require('../config/gridfs');
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required"
      });
    }

    const courseData = { 
      title, 
      price, 
      description,
      imageId: req.file ? req.file.id.toString() : null
    };

    const course = await Course.create(courseData);
    res.status(201).json({
      success: true,
      data: course,
      message: "Course Created Successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAllCoursesForUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const courses = await Course.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // student case
    if (req.user && req.user.role === "Student") {
      const orders = await Order.find({ student: req.user.id }).select("course");
      const boughtIds = new Set(orders.map(o => o.course.toString()));

      const wrapped = courses.map(c => ({
        _id: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
        imageId: c.imageId,
        imageUrl: c.imageUrl,
        isPurchased: boughtIds.has(c._id.toString()),
      }));

      return res.status(200).json({
        success: true,
        data: wrapped,
        pagination: {
          total: totalCourses,
          page,
          limit,
          totalPages: Math.ceil(totalCourses / limit),
        },
      });
    }

    // guest / admin
    const wrapped = courses.map(c => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      imageId: c.imageId,
      imageUrl: c.imageUrl,
    }));

    res.status(200).json({
      success: true,
      data: wrapped,
      pagination: {
        total: totalCourses,
        page,
        limit,
        totalPages: Math.ceil(totalCourses / limit),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Courses fetch failed",
    });
  }
};




exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.UpdateCourse = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (price) updateData.price = price;
    if (description) updateData.description = description;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.DeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getCourseImage = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = getBucket();

    if (!bucket) {
      return res.status(500).json({
        success: false,
        message: "GridFS not initialized"
      });
    }

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', (err) => {
      res.status(404).json({
        success: false,
        message: "Image not found"
      });
    });

    res.setHeader('Content-Type', 'image/jpeg');
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const orders = await Order
      .find({ student: userId, isPurchased: true })
      .populate("course");

    const myCourses = orders
      .filter(order => order.course)
      .map(order => ({
        _id: order.course._id,
        title: order.course.title,
        description: order.course.description,
        price: order.course.price,
        imageId: order.course.imageId
      }));

    res.status(200).json({
      success: true,
      data: myCourses
    });

  } catch (err) {
    console.error("MY COURSES ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

