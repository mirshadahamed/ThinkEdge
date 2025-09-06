import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentSlip: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
