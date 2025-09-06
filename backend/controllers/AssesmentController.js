// import express from 'express';
// import Assessment from "../models/Assesment.js"; 

// const router = express.Router(); 

// router.route("/add").post((req, res) => {
//     const topic = req.body.topic;
//     const courseId = req.body.courseId;
//     const description = req.body.description;
//     const link = req.body.link;

//     const newAssessment = new Assessment({
//         topic,
//         courseId,
//         description,
//         link
//     });

//     newAssessment.save()
//         .then(() => {
//             res.json("Assessment Added");
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send({ status: "Error in Adding Assessment", error: err.message });
//         });
// });

// router.route("/").get(async (req, res) => {
//     try {
//         const assessments = await Assessment.find();
//         res.json(assessments);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "Error in Fetching Assessments", error: err.message });
//     }
// });

// router.route("/Update/:id").put(async (req, res) => {
//     const ID = req.params.id;
//     const {topic,courseId, description, link } = req.body;

//     const updateAssessment = {
//         topic,
//         courseId,
//         description,
//         link
//     };

//     try {
//         const updatedAssessment = await Assessment.findByIdAndUpdate(ID, updateAssessment, { new: true });
//         res.status(200).send({ status: "Assessment Updated", updatedAssessment });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "Error in Assessment Update", error: err.message });
//     }
// });

// router.route("/Delete/:id").delete(async (req, res) => {
//     const ID = req.params.id;

//     try {
//         await Assessment.findByIdAndDelete(ID);
//         res.status(200).send({ status: "Assessment Deleted" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "Error in Assessment Deletion", error: err.message });
//     }
// });

// router.route("/get/:id").get(async (req, res) => {
//     const ID = req.params.id;

//     try {
//         const assessment = await Assessment.findById(ID);
//         if (assessment) {
//             res.status(200).json(assessment); // Send the fetched assessment back
//         } else {
//             res.status(404).send({ status: "Assessment not found" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "Error in Fetching Assessment", error: err.message });
//     }
// });
// router.route("/search").get(async (req, res) => {
//     const { topic, courseId } = req.query;  // Accept both studentId and courseId as query parameters

//     let query = {};  // Initialize an empty query object

//     // If studentId is provided, add it to the query filter
//     if (topic) {
//         query.topic = topic;
//     }

//     // If courseId is provided, add it to the query filter
//     if (courseId) {
//         query.courseId = courseId;
//     }

//     try {
//         const assessment = await Assessment.find(query);  // Fetch marks based on the query filters

//         if (assessment.length > 0) {
//             res.status(200).json(assessment);  // Return the list of marks matching the search criteria
//         } else {
//             res.status(404).send({ status: "Error", message: "No marks found for the given search criteria" });
//         }
//     } catch (err) {
//         console.log("Error in Fetching Marks by Search Criteria:", err);
//         res.status(500).send({ status: "Error in Fetching Marks", error: err.message });
//     }
// });

// // Get all assessments for a specific course
// router.route("/course/:courseId").get(async (req, res) => {
//     const { courseId } = req.params;

//     try {
//         const assessments = await Assessment.find({ courseId });
//         res.status(200).json({ assessments });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "Error fetching assessments by course ID", error: err.message });
//     }
// });


   
// export default router;


import express from 'express';
import multer from 'multer';
import Assessment from '../models/Assesment.js';

const router = express.Router();

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assessments/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Add new assessment
router.post('/add', upload.single('assessmentFile'), async (req, res) => {
  try {
    const { courseId, topic, description, assessmentLink } = req.body;

    const newAssessment = new Assessment({
      courseId,
      topic,
      description,
      assessmentLink: assessmentLink || '',
      assessmentFile: req.file ? req.file.filename : '',
    });

    await newAssessment.save();
    res.status(201).send({ message: 'Assessment added successfully!' });
  } catch (err) {
    console.error('Error adding assessment:', err);
    res.status(500).send({ message: 'Failed to add assessment', error: err.message });
  }
});

// (Optional) Get all assessments for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const assessments = await Assessment.find({ courseId: req.params.courseId });
    res.status(200).json({ assessments });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching assessments', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
    try {
      const assessment = await Assessment.findById(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.json({ assessment });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

// Delete assessment by ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const assessment = await Assessment.findByIdAndDelete(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.json({ message: 'Assessment deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

// Update assessment by ID
router.put('/update/:id', upload.single('assessmentFile'), async (req, res) => {
    try {
      const { courseId, topic, description, assessmentLink } = req.body;
  
      const updatedData = {
        courseId,
        topic,
        description,
        assessmentLink: assessmentLink || '',
      };
  
      if (req.file) {
        updatedData.assessmentFile = req.file.filename;
      }
  
      const assessment = await Assessment.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
  
      res.json({ message: 'Assessment updated successfully!', assessment });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  
  

export default router;
