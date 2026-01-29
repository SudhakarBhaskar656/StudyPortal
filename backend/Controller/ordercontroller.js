const Order = require('../Models/orders');
const Course = require('../Models/courses');

exports.buyCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const alreadyPurchased = await Order.findOne({ student: studentId, course: courseId });
    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "Course already purchased"
      });
    }

    const order = await Order.create({ student: studentId, course: courseId, isPurchased: true });
    res.status(200).json({
      success: true,
      data: order,
      message: "Course purchased successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const studentId = req.user.id;
    const orders = await Order
      .find({ student: studentId })
      .populate('course', 'title description price');
    
    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// For Admin - get all orders
exports.GetAllOrders = async (req, res) => {
  try {
    const orders = await Order
      .find()
      .populate('student', 'name email')
      .populate('course', 'title description price');
    
    res.status(200).json({
      success: true,
      data: orders,
      message: "All orders fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};