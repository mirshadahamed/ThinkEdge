// import express from 'express';
// import multer from 'multer';
// import Submission from '../models/Submission.js';
// import authenticateUser from '../middleware/authenticateUser.js';

// const router = express.Router();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/submissions/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// router.post('/add',authenticateUser, upload.single('submissionFile'), async (req, res) => {
//     try {
//         const { assessmentId, courseId } = req.body;
//         const file = req.file;
    
//         if (!assessmentId || !courseId || !file) {
//           return res.status(400).json({ message: 'Missing required fields' });
//         }
//     const newSubmission = new Submission({
//       assessmentId,
//       userId: req.userId,  // assuming auth middleware sets this
//       courseId:req.body.courseId,
//       submissionFile: req.file.filename,
//       submittedAt: new Date(),
//       status: 'Submitted for Evaluation',
//     });
//     await newSubmission.save();
//     res.status(201).send({ message: 'Submission uploaded successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Submission failed.', error: err.message });
//   }
// });


// // Fetch all submissions for a course's assessment
// router.get('/submissions', async (req, res) => {
//   try {
//     const submissions = await Submission.find();
//     res.status(200).json({ submissions });
//   } catch (err) {
//     console.error('Error fetching submissions:', err);
//     res.status(500).json({ message: 'Error fetching submissions' });
//   }
// });

// // Fetch all submissions for a course's assessments
// // router.get('/submissions/:courseId', async (req, res) => {
// //   try {
// //     const courseId = req.params.courseId;

// //     // Find all submissions where the related assessment belongs to this course
// //     const submissions = await Submission.find()
// //       .populate({
// //         path: 'assessmentId',
// //         match: { courseId: courseId }
// //       })
// //       .populate('userId');

// //     // Filter out submissions whose assessmentId didn't match (i.e. was null after populate)
// //     const filteredSubmissions = submissions.filter(sub => sub.assessmentId !== null);

// //     res.status(200).json({ submissions: filteredSubmissions });
// //   } catch (err) {
// //     console.error('Error fetching submissions:', err);
// //     res.status(500).json({ message: 'Error fetching submissions' });
// //   }
// // });


// // Mark a submission with grade and feedback
// router.put('/grade-submission/:submissionId', async (req, res) => {
//   const { grade, feedback } = req.body;

//   try {
//     const submission = await Submission.findById(req.params.submissionId);
//     if (!submission) {
//       return res.status(404).json({ message: 'Submission not found' });
//     }

//     submission.grade = grade;
//     submission.feedback = feedback;
//     submission.status = 'Graded';
    
//     await submission.save();
//     res.status(200).json({ message: 'Submission graded successfully', submission });
//   } catch (err) {
//     console.error('Error grading submission:', err);
//     res.status(500).json({ message: 'Error grading submission' });
//   }
// });

// router.get('/Student-Submission/:userId', async (req, res) => {
//     try {
//       const { userId } = req.params;
      
//       // Find user first to verify they exist
//       const user = await User.findOne({
//         $or: [
//           { _id: userId },
//           { username: userId },
//           { email: userId }
//         ]
//       });
      
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
  
//       // Find courses by the user's actual _id
//       const courses = await Course.find({ userId: user._id }).sort({ createdAt: -1 });
      
//       res.status(200).json({ success: true, courses });
//     } catch (err) {
//       console.error('Error fetching instructor courses:', err);
//       res.status(500).json({ success: false, message: 'Failed to fetch courses' });
//     }
//   });

// router.put('/reset-grade/:id', authenticateUser, async (req, res) => {
//   try {
//     const submission = await Submission.findById(req.params.id);
//     if (!submission) {
//       return res.status(404).json({ message: 'Submission not found' });
//     }

//     submission.grade = '';
//     submission.feedback = '';
//     submission.status = 'Submitted for Evaluation';

//     await submission.save();

//     res.status(200).json({ message: 'Grading removed and status reset.' });
//   } catch (error) {
//     console.error('Error resetting grading:', error);
//     res.status(500).json({ message: 'Failed to reset grading.' });
//   }
// });



// export default router;
import express from 'express';
import multer from 'multer';
import path from 'path';
import Submission from '../models/Submission.js';
import Assessment from '../models/Assesment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import authenticateUser from '../middleware/authenticateUser.js';
import authenticateInstructor from '../middleware/authenticateUser.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/submissions/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and ZIP files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Student Submission Endpoints
router.post('/add', authenticateUser, upload.single('submissionFile'), async (req, res) => {
  try {
    const { assessmentId, courseId } = req.body;
    
    if (!assessmentId || !courseId || !req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Assessment ID, Course ID, and submission file are required' 
      });
    }

    // Verify assessment exists and belongs to the course
    const assessment = await Assessment.findOne({ 
      _id: assessmentId, 
      courseId 
    });
    
    if (!assessment) {
      return res.status(404).json({ 
        success: false,
        message: 'Assessment not found or does not belong to this course' 
      });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not enrolled in this course' 
      });
    }

    // Check for existing submission
    const existingSubmission = await Submission.findOne({
      userId: req.userId,
      assessmentId
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already submitted for this assessment. Please edit your existing submission.' 
      });
    }

    const newSubmission = new Submission({
      assessmentId,
      userId: req.userId,
      courseId,
      file: req.file.path,
      submissionFile: req.file.originalname,
      submittedAt: new Date(),
      status: 'Submitted for Evaluation'
    });

    await newSubmission.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Submission uploaded successfully',
      submission: newSubmission
    });

  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to submit assignment' 
    });
  }
});

// Get all submissions for a specific assessment (Instructor only)
router.get('/assessment/:assessmentId', authenticateInstructor, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      assessmentId: req.params.assessmentId 
    })
    .populate('userId', 'name email')
    .sort({ submittedAt: -1 });

    res.status(200).json({ 
      success: true,
      submissions 
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch submissions' 
    });
  }
});

// Get a student's submission for an assessment
router.get('/assessment/:assessmentId/student', authenticateUser, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assessmentId: req.params.assessmentId,
      userId: req.userId
    });

    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: 'Submission not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      submission 
    });
  } catch (err) {
    console.error('Error fetching submission:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch submission' 
    });
  }
});

// Get all submissions for a course (Instructor only)
router.get('/course/:courseId', authenticateInstructor, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      courseId: req.params.courseId 
    })
    .populate('userId', 'name email')
    .populate('assessmentId', 'topic')
    .sort({ submittedAt: -1 });

    res.status(200).json({ 
      success: true,
      submissions 
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch submissions' 
    });
  }
});

// Grade a submission (Instructor only)
router.put('/grade/:submissionId', authenticateInstructor, async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    
    if (!grade || typeof grade !== 'number' || grade < 0 || grade > 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Grade must be a number between 0 and 100' 
      });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { 
        grade,
        feedback,
        status: 'Graded',
        gradedAt: new Date()
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: 'Submission not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Submission graded successfully',
      submission 
    });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to grade submission' 
    });
  }
});

// Reset grade (Instructor only)
// router.put('/reset-grade/:submissionId', authenticateInstructor, async (req, res) => {
//   try {
//     const submission = await Submission.findByIdAndUpdate(
//       req.params.submissionId,
//       { 
//         grade: null,
//         feedback: '',
//         status: 'Submitted',
//         gradedAt: null
//       },
//       { new: true }
//     );

//     if (!submission) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Submission not found' 
//       });
//     }

//     res.status(200).json({ 
//       success: true,
//       message: 'Grade reset successfully',
//       submission 
//     });
//   } catch (err) {
//     console.error('Error resetting grade:', err);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to reset grade' 
//     });
//   }
// });

// // Fetch all submissions for a course's assessment
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// Fetch all submissions for a course's assessments
// router.get('/submissions/:courseId', async (req, res) => {
//   try {
//     const courseId = req.params.courseId;

//     // Find all submissions where the related assessment belongs to this course
//     const submissions = await Submission.find()
//       .populate({
//         path: 'assessmentId',
//         match: { courseId: courseId }
//       })
//       .populate('userId');

//     // Filter out submissions whose assessmentId didn't match (i.e. was null after populate)
//     const filteredSubmissions = submissions.filter(sub => sub.assessmentId !== null);

//     res.status(200).json({ submissions: filteredSubmissions });
//   } catch (err) {
//     console.error('Error fetching submissions:', err);
//     res.status(500).json({ message: 'Error fetching submissions' });
//   }
// });


// Mark a submission with grade and feedback
router.put('/grade-submission/:submissionId', async (req, res) => {
  const { grade, feedback } = req.body;

  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'Graded';
    
    await submission.save();
    res.status(200).json({ message: 'Submission graded successfully', submission });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({ message: 'Error grading submission' });
  }
});

router.get('/Student-Submission/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find user first to verify they exist
      const user = await User.findOne({
        $or: [
          { _id: userId },
          { username: userId },
          { email: userId }
        ]
      });
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Find courses by the user's actual _id
      const courses = await Course.find({ userId: user._id }).sort({ createdAt: -1 });
      
      res.status(200).json({ success: true, courses });
    } catch (err) {
      console.error('Error fetching instructor courses:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
  });

router.put('/reset-grade/:id', authenticateUser, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = '';
    submission.feedback = '';
    submission.status = 'Submitted for Evaluation';

    await submission.save();

    res.status(200).json({ message: 'Grading removed and status reset.' });
  } catch (error) {
    console.error('Error resetting grading:', error);
    res.status(500).json({ message: 'Failed to reset grading.' });
  }
});


// Edit submission (Student)
router.put('/edit/:submissionId', authenticateUser, upload.single('submissionFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'New submission file is required' 
      });
    }

    const submission = await Submission.findOneAndUpdate(
      { 
        _id: req.params.submissionId,
        userId: req.userId,
        status: { $ne: 'Graded' } // Can't edit if already graded
      },
      { 
        file: req.file.path,
        submissionFile: req.file.originalname,
        submittedAt: new Date(),
        status: 'Submitted for Evaluation'
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: 'Submission not found or cannot be edited' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Submission updated successfully',
      submission 
    });
  } catch (err) {
    console.error('Error editing submission:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to edit submission' 
    });
  }
});

// Download submission file
router.get('/download/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    
    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: 'Submission not found' 
      });
    }

    const filePath = path.join(__dirname, '..', submission.file);
    res.download(filePath, submission.filename);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to download file' 
    });
  }
});

// Backend route to get submissions for a specific user in a course
// router.get('/course/:courseId/user/:userId', authenticateUser, async (req, res) => {
//   try {
//     const submissions = await Submission.find({
//       userId: req.params.userId,
//       courseId: req.params.courseId
//     });

//     res.status(200).json({ 
//       success: true,
//       submissions 
//     });
//   } catch (err) {
//     console.error('Error fetching submissions:', err);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch submissions' 
//     });
//   }
// });


// Update submission
router.put('/:submissionId', authenticateUser, upload.single('submissionFile'), async (req, res) => {
  try {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.submissionId, userId: req.userId },
      { 
        file: req.file.path,
        filename: req.file.originalname,
        submittedAt: new Date(),
        status: 'Resubmitted'
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ submission });
  } catch (err) {
    console.error('Error updating submission:', err);
    res.status(500).json({ message: 'Failed to update submission' });
  }
});

// Delete submission
router.delete('/:submissionId', authenticateUser, async (req, res) => {
  try {
    const submission = await Submission.findOneAndDelete({
      _id: req.params.submissionId,
      userId: req.userId
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ message: 'Failed to delete submission' });
  }
});

// Get user submissions for a course
router.get('/course/:courseId/user/:userId', authenticateUser, async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.params.userId,
      courseId: req.params.courseId
    });

    res.status(200).json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});


export default router;