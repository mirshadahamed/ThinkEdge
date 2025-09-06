import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assessmentFile: {
    type: String,
  },
  assessmentLink: {
    type: String,
  },
});

export default mongoose.model('Assessment', assessmentSchema);
