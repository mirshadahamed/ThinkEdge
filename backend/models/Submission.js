import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  submissionFile: { type: String, required: true },
  submittedAt: { type: Date, required: true },
  status: { type: String, default: 'Submitted for Evaluation' },
  grade: { type: String, default: '' },
  feedback: { type: String, default: '' },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
