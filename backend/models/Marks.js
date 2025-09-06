import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
    studentId: String,
    courseId: String,
    marks: Number
});

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;  // Make sure you're exporting it like this
