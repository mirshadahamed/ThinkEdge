// import express from 'express';
// import Progress from "../models/Progress.js";
// import authenticateUser from '../middleware/authenticateUser.js';

// const router = express.Router();

// router.post('/toggle-lecture',authenticateUser, async (req, res) => {
//   try {
//     const { courseId, lectureId, userId } = req.body;

//     // Find or create progress record
//     let progress = await Progress.findOne({
//       courseId,
//       userId
//     });

//     if (!progress) {
//       progress = new Progress({
//         userId,
//         courseId,
//         completedLectures: []
//       });
//     }

//     // Check if lecture is already completed
//     const lectureIndex = progress.completedLectures.indexOf(lectureId);

//     if (lectureIndex === -1) {
//       // Add to completed lectures
//       progress.completedLectures.push(lectureId);
//     } else {
//       // Remove from completed lectures
//       progress.completedLectures.splice(lectureIndex, 1);
//     }

//     await progress.save();

//     res.status(200).json({
//       completedLectures: progress.completedLectures
//     });
//   } catch (error) {
//     console.error('Error toggling lecture completion:', error);
//     res.status(500).json({
//       error: 'Failed to toggle lecture completion status'
//     });
//   }
// });

// router.get('/:courseId/:userId',authenticateUser, async (req, res) => {
//   try {
//     const { courseId, userId } = req.params;

//     const progress = await Progress.findOne({
//       courseId,
//       userId
//     }).populate('completedLectures');

//     if (!progress) {
//       return res.status(200).json({
//         completedLectures: []
//       });
//     }

//     res.status(200).json({
//       completedLectures: progress.completedLectures
//     });
//   } catch (error) {
//     console.error('Error fetching progress:', error);
//     res.status(500).json({
//       error: 'Failed to fetch progress'
//     });
//   }
// });


// export default router;

import express from 'express';
import Progress from "../models/Progress.js";
import Course from "../models/Course.js"; 
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.post('/toggle-lecture', authenticateUser, async (req, res) => {
  try {
    const { courseId, lectureId, userId } = req.body;

    // Verify lecture exists in course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lectureExists = course.lectures.some(lecture => 
      lecture._id.toString() === lectureId
    );
    if (!lectureExists) {
      return res.status(404).json({ error: 'Lecture not found in course' });
    }

    // Find or create progress record
    let progress = await Progress.findOne({ courseId, userId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLectures: []
      });
    }

    // Toggle lecture completion
    const lectureIndex = progress.completedLectures.indexOf(lectureId);
    if (lectureIndex === -1) {
      progress.completedLectures.push(lectureId);
    } else {
      progress.completedLectures.splice(lectureIndex, 1);
    }

    await progress.save();

    res.status(200).json({
      completedLectures: progress.completedLectures
    });
  } catch (error) {
    console.error('Error toggling lecture completion:', error);
    res.status(500).json({
      error: 'Failed to toggle lecture completion status'
    });
  }
});

router.get('/:courseId/:userId', authenticateUser, async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const progress = await Progress.findOne({ courseId, userId });
    const course = await Course.findById(courseId);

    if (!progress || !course) {
      return res.status(200).json({
        completedLectures: []
      });
    }

    // Map to include lecture details
    const lecturesWithCompletion = course.lectures.map(lecture => ({
      ...lecture.toObject(),
      completed: progress.completedLectures.includes(lecture._id.toString())
    }));

    res.status(200).json({
      completedLectures: progress.completedLectures,
      lectures: lecturesWithCompletion // Optional: send full lecture data
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      error: 'Failed to fetch progress'
    });
  }
});

export default router;
