// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import Course from '../models/Course.js';

// const router = express.Router();

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// // ───── Controller + Routes ─────

// // Add Course
// // Add Course (fix)
// router.post(`/add`, upload.any(), async (req, res) => {
//     try {
//       const {
//         userId,
//         courseId,
//         courseName,
//         courseAmount,
//         courseDescription,
//         courseDuration
//       } = req.body;
  
//       const lectures = [];
//       let i = 0;
//       while (req.body[`lectures[${i}][topicName]`]) {
//         const materialFile = req.files.find(
//           (file) => file.fieldname === `lectures[${i}][material]`
//         );
//         lectures.push({
//           topicName: req.body[`lectures[${i}][topicName]`],
//           material: materialFile ? materialFile.filename : null
//         });
//         i++;
//       }
  
//       const coursePhotoFile = req.files.find(
//         (file) => file.fieldname === 'coursePhoto'
//       );
  
//       const newCourse = new Course({
//         userId,
//         courseId,
//         courseName,
//         coursePhoto: coursePhotoFile ? coursePhotoFile.filename : null,
//         courseAmount: parseFloat(courseAmount),
//         courseDescription,
//         courseDuration,
//         lectures
//       });
  
//       await newCourse.save();
//       res.status(201).json({ message: 'Course added successfully.' });
  
//     } catch (err) {
//       console.error('Add course error:', err);
//       res.status(500).json({ message: 'Failed to add course.', error: err.message });
//     }
//   });
  
// // Get All Courses
// router.get('/get', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json({ success: true, courses });
//   } catch (err) {
//     console.error('Fetch courses error:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch courses.', error: err.message });
//   }
// });

// // Get Course By ID
// router.get('/detail/:id', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found.' });
//     }
//     res.status(200).json({ success: true, course });
//   } catch (err) {
//     console.error('Fetch course error:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch course.', error: err.message });
//   }
// });

// // Update Course
// router.put('/edit/:id', upload.fields([
//   { name: 'coursePhoto', maxCount: 1 },
//   { name: 'lectures[0][material]' },
//   { name: 'lectures[1][material]' },
//   { name: 'lectures[2][material]' },
//   { name: 'lectures[3][material]' }
// ]), async (req, res) => {
//   try {
//     const lectures = [];
//     let i = 0;
//     while (req.body[`lectures[${i}][topicName]`]) {
//       lectures.push({
//         topicName: req.body[`lectures[${i}][topicName]`],
//         material: req.files[`lectures[${i}][material]`]
//           ? req.files[`lectures[${i}][material]`][0].filename
//           : null
//       });
//       i++;
//     }

//     const updatedData = {
//       courseId: req.body.courseId,
//       courseName: req.body.courseName,
//       coursePhoto: req.files['coursePhoto'] ? req.files['coursePhoto'][0].filename : undefined,
//       courseAmount: parseFloat(req.body.courseAmount),
//       courseDescription: req.body.courseDescription,
//       courseDuration: req.body.courseDuration,
//       lectures
//     };

//     Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

//     const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });

//     if (!updatedCourse) {
//       return res.status(404).json({ success: false, message: 'Course not found.' });
//     }

//     res.status(200).json({ success: true, message: 'Course updated successfully.', updatedCourse });

//   } catch (err) {
//     console.error('Update course error:', err);
//     res.status(500).json({ success: false, message: 'Failed to update course.', error: err.message });
//   }
// });

// // Delete Course
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const result = await Course.findByIdAndDelete(req.params.id);
//     if (!result) {
//       return res.status(404).json({ success: false, message: 'Course not found.' });
//     }
//     res.status(200).json({ success: true, message: 'Course deleted successfully.' });
//   } catch (err) {
//     console.error('Delete course error:', err);
//     res.status(500).json({ success: false, message: 'Failed to delete course.', error: err.message });
//   }
// });

// router.put('/update/:id', upload.single('coursePhoto'), async (req, res) => {
//     try {
//       const { courseId, courseName, courseDescription, courseAmount, courseDuration } = req.body;
  
//       if (!courseId || !courseName || !courseAmount || !courseDuration || !courseDescription) {
//         return res.status(400).json({ message: 'All fields are required.' });
//       }
  
//       const course = await Course.findById(req.params.id);
//       if (!course) {
//         return res.status(404).json({ message: 'Course not found.' });
//       }
  
//       // Update fields
//       course.courseId = courseId;
//       course.courseName = courseName;
//       course.courseDescription = courseDescription;
//       course.courseAmount = courseAmount;
//       course.courseDuration = courseDuration;
  
//       // Replace course photo if uploaded
//       if (req.file) {
//         course.coursePhoto = req.file.filename;
//       }
  
//       // Parse and update lectures if sent
//       if (req.body.lectures) {
//         const parsedLectures = JSON.parse(req.body.lectures);
//         course.lectures = parsedLectures;
//       }
  
//       await course.save();
  
//       res.status(200).json({ message: 'Course updated successfully.' });
//     } catch (err) {
//       console.error('Course update error:', err);
//       res.status(500).json({ message: 'Failed to update course.', error: err.message });
//     }
// });

// router.get('/user/enrolled-courses', async (req, res) => {
//     try {
//       // Assuming you have user authentication and user ID is available in req.user
//       const userId = req.user.id;
  
//       // Fetch user and their enrolled courses
//       const user = await User.findById(userId).populate('enrolledCourses');
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found.' });
//       }
  
//       res.status(200).json({ success: true, enrolledCourses: user.enrolledCourses });
//     } catch (err) {
//       console.error('Error fetching enrolled courses:', err);
//       res.status(500).json({ success: false, message: 'Failed to fetch enrolled courses.', error: err.message });
//     }
// });

// // Enroll User in a Course
// router.post('/user/enroll/:courseId', async (req, res) => {
//     try {
//       const userId = req.user.id; // Get the user ID from the authentication middleware
//       const courseId = req.params.courseId; // Get the course ID from the route parameter
  
//       // Find the user and add the course to their enrolled courses
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found.' });
//       }
  
//       // Check if the user is already enrolled in the course
//       if (user.enrolledCourses.includes(courseId)) {
//         return res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
//       }
  
//       // Add course to the user's enrolled courses
//       user.enrolledCourses.push(courseId);
//       await user.save();
  
//       res.status(200).json({ success: true, message: 'Successfully enrolled in the course.' });
//     } catch (err) {
//       console.error('Enrollment error:', err);
//       res.status(500).json({ success: false, message: 'Failed to enroll in course.', error: err.message });
//     }
//   });
  

// export default router;
import express from 'express';
import multer from 'multer';
import path from 'path';
import Course from '../models/Course.js';
import User from '../models/User.js'; // Make sure to import User model
import authenticateUser from '../middleware/authenticateUser.js'; // Adjust path as necessary

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// ───── Controller + Routes ─────

// Add Course


router.post(`/add`, upload.any(), async (req, res) => {
  try {
    const {
      userId,
      courseId,
      courseName,
      courseAmount,
      courseDescription,
      courseDuration
    } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const lectures = [];
    let i = 0;
    // Changed to match frontend format with dot notation
    while (req.body[`lectures[${i}].topicName`]) {
      const materialFile = req.files.find(
        (file) => file.fieldname === `lectures[${i}].material`
      );
      lectures.push({
        topicName: req.body[`lectures[${i}].topicName`],
        material: materialFile ? materialFile.filename : null
      });
      i++;
    }

    const coursePhotoFile = req.files.find(
      (file) => file.fieldname === 'coursePhoto'
    );

    const newCourse = new Course({
      userId: user._id,
      courseId,
      courseName,
      coursePhoto: coursePhotoFile ? coursePhotoFile.filename : null,
      courseAmount: parseFloat(courseAmount),
      courseDescription,
      courseDuration,
      lectures
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully.' });

  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Failed to add course.', error: err.message });
  }
});





// Get All Courses
router.get('/get', async (req, res) => {
  try {
    const courses = await Course.find().populate('userId', 'username email'); // Populate user info
    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses.', error: err.message });
  }
});

// Get Course By ID
router.get('/detail/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('userId', 'username email');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    res.status(200).json({ success: true, course });
  } catch (err) {
    console.error('Fetch course error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch course.', error: err.message });
  }
});

// Update Course
router.put('/edit/:id', upload.fields([
  { name: 'coursePhoto', maxCount: 1 },
  { name: 'lectures[0][material]' },
  { name: 'lectures[1][material]' },
  { name: 'lectures[2][material]' },
  { name: 'lectures[3][material]' }
]), async (req, res) => {
  try {
    const lectures = [];
    let i = 0;
    while (req.body[`lectures[${i}][topicName]`]) {
      lectures.push({
        topicName: req.body[`lectures[${i}][topicName]`],
        material: req.files[`lectures[${i}][material]`]
          ? req.files[`lectures[${i}][material]`][0].filename
          : null
      });
      i++;
    }

    const updatedData = {
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      coursePhoto: req.files['coursePhoto'] ? req.files['coursePhoto'][0].filename : undefined,
      courseAmount: parseFloat(req.body.courseAmount),
      courseDescription: req.body.courseDescription,
      courseDuration: req.body.courseDuration,
      lectures
    };

    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.status(200).json({ success: true, message: 'Course updated successfully.', updatedCourse });

  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ success: false, message: 'Failed to update course.', error: err.message });
  }
});

// Delete Course
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await Course.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete course.', error: err.message });
  }
});


//  update  PUT route like this:
router.put('/update/:id', upload.any(), async (req, res) => {
  try {
    const { 
      courseName,
      courseId,
      courseDescription,
      courseAmount,
      courseDuration,
      lectures // This should be a JSON string of lectures array
    } = req.body;

    // Find the course
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update basic fields
    course.courseName = courseName || course.courseName;
    course.courseId = courseId || course.courseId;
    course.courseDescription = courseDescription || course.courseDescription;
    course.courseAmount = courseAmount || course.courseAmount;
    course.courseDuration = courseDuration || course.courseDuration;

    // Handle files
    const files = req.files || [];
    
    // Handle course photo
    const coursePhotoFile = files.find(file => file.fieldname === 'coursePhoto');
    if (coursePhotoFile) {
      course.coursePhoto = coursePhotoFile.filename;
    }

    // Handle lectures
    if (lectures) {
      let parsedLectures;
      try {
        parsedLectures = JSON.parse(lectures);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid lectures format' });
      }

      const updatedLectures = parsedLectures.map((lecture, index) => {
        // Find the corresponding file for this lecture
        const materialFile = files.find(
          file => file.fieldname === `lectures[${index}][material]`
        );
        
        return {
          topicName: lecture.topic,
          material: materialFile ? materialFile.filename : lecture.material
        };
      });

      course.lectures = updatedLectures;
    }

    await course.save();
    res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully',
      course 
    });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update course',
      error: err.message 
    });
  }
});
// Update Course - consolidated route
// router.put('/update/:id', upload.fields([
//   { name: 'coursePhoto', maxCount: 1 },
//   { name: 'lectures[*][material]' }
// ]), async (req, res) => {
//   try {
//     const { 
//       courseName,
//       courseId,
//       courseDescription,
//       courseAmount,
//       courseDuration,
//       lectures // This should be a JSON string of lectures array
//     } = req.body;

//     // Find the course
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Update basic fields
//     course.courseName = courseName;
//     course.courseId = courseId;
//     course.courseDescription = courseDescription;
//     course.courseAmount = courseAmount;
//     course.courseDuration = courseDuration;

//     // Handle course photo
//     if (req.files['coursePhoto']) {
//       course.coursePhoto = req.files['coursePhoto'][0].filename;
//     }

//     // Handle lectures
//     if (lectures) {
//       const parsedLectures = JSON.parse(lectures);
      
//       // Process lecture materials
//       parsedLectures.forEach((lecture, index) => {
//         if (req.files[`lectures[${index}][material]`]) {
//           lecture.material = req.files[`lectures[${index}][material]`][0].filename;
//         }
//       });

//       course.lectures = parsedLectures;
//     }

//     await course.save();
//     res.status(200).json({ 
//       success: true, 
//       message: 'Course updated successfully',
//       course 
//     });
//   } catch (err) {
//     console.error('Update course error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to update course',
//       error: err.message 
//     });
//   }
// });

// Get enrolled courses for authenticated user
router.get('/user/enrolled-courses', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate('enrolledCourses');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch enrolled courses.', error: err.message });
  }
});


// Enroll User in a Course
router.post('/user/enroll/:courseId', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId; // Retrieved from decoded token
    const courseId = req.params.courseId;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check for existing enrollment
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
    }

    // Add course to enrolledCourses
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ success: true, message: 'Successfully enrolled in the course.', enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ success: false, message: 'Failed to enroll in course.', error: err.message });
  }
});



router.get('/instructor-courses/:userId', async (req, res) => {
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

router.get('/get/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('userId', 'username email');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    // Transform the course data to match frontend expectations
    const transformedCourse = course.toObject();
    transformedCourse.lectures = course.lectures.map(lecture => ({
      topic: lecture.topicName,  // Rename topicName to topic
      material: lecture.material // Keep material as is
    }));
    res.status(200).json({ success: true, course });
  } catch (err) {
    console.error('Fetch course error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch course.', error: err.message });
  }
});

export default router;