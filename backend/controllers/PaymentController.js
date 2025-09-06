import express from 'express';
import multer from 'multer';
import Payment from '../models/Payment.js';
import authenticateUser from '../middleware/authenticateUser.js'; 

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Submit payment
router.post('/submit', upload.single('paymentSlip'), async (req, res) => {
  try {
    const { userId, userName, userEmail, courseId, courseName, amount } = req.body;

    const newPayment = new Payment({
      userId,
      userName,
      userEmail,
      courseId,
      courseName,
      amount,
      paymentSlip: req.file.filename,
      status: 'Pending'
    });

    await newPayment.save();
    res.status(201).send({ message: 'Payment submitted successfully!' });

  } catch (err) {
    console.error('Payment submission error:', err);
    res.status(500).send({ message: 'Failed to submit payment', error: err.message });
  }
});

// Get all payments (for admin review)
router.get('/all', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ payments }); 
  } catch (err) {
    res.status(500).send({ message: 'Error fetching payments', error: err.message });
  }
});


// Approve or reject a payment
router.put('/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!payment) return res.status(404).send({ message: 'Payment not found' });

    res.status(200).send({ message: `Payment ${status}`, payment });
  } catch (err) {
    res.status(500).send({ message: 'Error updating payment status', error: err.message });
  }
});

router.get('/status/:courseId', authenticateUser,async (req, res) => {
    const { courseId } = req.params;
    const userId = req.userId; // assuming your middleware decodes token & adds user info
  
    try {
      const payment = await Payment.findOne({ courseId, userId });
      if (!payment) {
        return res.json({ status: 'Not Enrolled' });
      }
      res.json({ status: payment.status });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  });
  

  // Get payment history for a user
  router.get('/history/:userId', async (req, res) => {
    try {
      const payments = await Payment.find({ userId: req.params.userId })
        .sort({ createdAt: -1 });
      
      console.log('Found payments:', payments); // Debug log
      
      res.json({ 
        success: true,
        payments // Make sure this matches what frontend expects
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching payment history' });
    }
  });


export default router;
