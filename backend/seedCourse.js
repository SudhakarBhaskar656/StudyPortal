const mongoose = require("mongoose");
const Course = require("../backend/Models/courses");

const MONGO_URI =  'mongodb+srv://sudhakarbhaskar7:HIQWhgNIbJgGSjes@cluster0.6fsqd3i.mongodb.net/studyPortal';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error", err));

const courseTitles = [
  "Complete Web Development Bootcamp",
  "Advanced Backend Development with Node.js",
  "Mastering React.js",
  "Full Stack MERN Development",
  "JavaScript Deep Dive",
  "System Design Fundamentals",
  "Docker & DevOps Essentials",
  "AWS Cloud Basics",
  "Clean Code Practices",
  "Authentication & Security",
  "Microservices Architecture",
  "CI/CD Pipelines",
  "MongoDB Advanced Guide",
  "REST API Development",
  "Next.js Complete Guide",
  "Redux Toolkit Mastery",
  "TypeScript in Depth",
  "Building SaaS Applications",
  "Web Performance Optimization",
  "Interview Preparation Bootcamp"
];

const seedCourses = async () => {
  try {
    await Course.deleteMany();

    const courses = [];

    for (let i = 1; i <= 100; i++) {
      const title = courseTitles[i % courseTitles.length]; // ✅ DEFINE TITLE

      courses.push({
        title,
        description: `Learn ${title} with real-world projects and hands-on examples.`,
        price: Math.floor(Math.random() * 900) + 199,
        imageUrl: `https://picsum.photos/seed/course${i}/600/400`,
        imageId: null
      });
    }

    await Course.insertMany(courses);

    const count = await Course.countDocuments();
    console.log("🔥 TOTAL COURSES INSERTED 👉", count);

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedCourses();
