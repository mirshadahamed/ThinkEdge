import mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
  topicName: String,
  material: String,
});

const CourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    
  courseId: String,
  courseName: String,
  coursePhoto: String,
  courseAmount: Number,
  courseDescription: String,
  courseDuration: String,
  lectures: [LectureSchema],
});

const Course = mongoose.model("Course",CourseSchema);
export default Course