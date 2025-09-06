import express from 'express';
import Marks from "../models/Marks.js";
import User from '../models/User.js';  // Assuming you have a User model
import { generateCertificatePDF } from '../utils/pdfGenerator.js'; 


const router = express.Router();

// Add Marks
router.route("/add").post((req, res) => {
    const { studentId, courseId, marks } = req.body;

    // Simple validation for input
    if (typeof marks !== 'number') {
        return res.status(400).send({ status: "Error", message: "Missing or invalid data" });
    }

    const newMarks = new Marks({
        studentId,
        courseId,
        marks
    });

    newMarks.save()
        .then(() => {
            res.json("Marks Added");
        })
        .catch((err) => {
            console.log("Error in Adding Marks:", err);
            res.status(500).send({ status: "Error in Adding Marks", error: err.message });
        });
});

// Get all Marks
router.route("/").get(async (req, res) => {
    try {
        const marks = await Marks.find(); // Fetch all marks
        res.json(marks);
    } catch (err) {
        console.log("Error in Fetching Marks:", err);
        res.status(500).send({ status: "Error in Fetching Marks", error: err.message });
    }
});

// Update Marks
router.route("/Update/:id").put(async (req, res) => {
    const ID = req.params.id;
    const { studentId, courseId, marks } = req.body;

    // Simple validation for input
    if (typeof marks !== 'number') {
        return res.status(400).send({ status: "Error", message: "Missing or invalid data" });
    }

    const marksToUpdate = {
        studentId,
        courseId,
        marks
    };

    try {
        const updatedMarks = await Marks.findByIdAndUpdate(ID, marksToUpdate, { new: true });
        
        if (updatedMarks) {
            res.status(200).send({ status: "Marks Updated", updatedMarks });
        } else {
            res.status(404).send({ status: "Error", message: "Marks not found" });
        }
    } catch (err) {
        console.log("Error in Marks Update:", err);
        res.status(500).send({ status: "Error in Marks Update", error: err.message });
    }
});

// Delete Marks
router.route("/Delete/:id").delete(async (req, res) => {
    const ID = req.params.id;

    try {
        const deletedMarks = await Marks.findByIdAndDelete(ID);
        
        if (deletedMarks) {
            res.status(200).send({ status: "Marks Deleted" });
        } else {
            res.status(404).send({ status: "Error", message: "Marks not found" });
        }
    } catch (err) {
        console.log("Error in Marks Deletion:", err);
        res.status(500).send({ status: "Error in Marks Deletion", error: err.message });
    }
});

// Get Marks by ID
router.route("/get/:id").get(async (req, res) => {
    const ID = req.params.id;

    try {
        const marks = await Marks.findById(ID); // Fetch marks by ID
        if (marks) {
            res.status(200).json(marks); // Return the fetched marks
        } else {
            res.status(404).send({ status: "Error", message: "Marks not found" });
        }
    } catch (err) {
        console.log("Error in Fetching Marks by ID:", err);
        res.status(500).send({ status: "Error in Fetching Marks", error: err.message });
    }
});

// **New Route: Get Marks by Student ID or Course ID**
// **New Route: Get Marks by Student ID or Course ID**
router.route("/search").get(async (req, res) => {
    const { studentId, courseId } = req.query;  // Accept both studentId and courseId as query parameters

    let query = {};  // Initialize an empty query object

    // If studentId is provided, add it to the query filter
    if (studentId) {
        query.studentId = studentId;
    }

    // If courseId is provided, add it to the query filter
    if (courseId) {
        query.courseId = courseId;
    }

    try {
        const marks = await Marks.find(query);  // Fetch marks based on the query filters

        if (marks.length > 0) {
            res.status(200).json(marks);  // Return the list of marks matching the search criteria
        } else {
            res.status(404).send({ status: "Error", message: "No marks found for the given search criteria" });
        }
    } catch (err) {
        console.log("Error in Fetching Marks by Search Criteria:", err);
        res.status(500).send({ status: "Error in Fetching Marks", error: err.message });
    }
});
router.route("/search/:studentId").get(async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Find all marks for a given studentId
        const marks = await Marks.find({ studentId });

        if (marks.length > 0) {
            res.status(200).json(marks); // Return the list of marks for that student
        } else {
            res.status(404).send({ status: "Error", message: "No marks found for this student ID" });
        }
    } catch (err) {
        console.log("Error in Fetching Marks by Student ID:", err);
        res.status(500).send({ status: "Error in Fetching Marks", error: err.message });
    }
});
router.route("/profile").get(async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming you're using JWT or session for user identification
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Fetch courses that user is enrolled in
        const courses = await Marks.find({ studentId: userId }).populate('courseId');
        
        res.json({ user, courses });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send({ message: 'Error fetching user profile', error: error.message });
    }
});

// 2. Get Assessment Results and Generate Certificate
router.route("/generate-certificate/:courseId").get(async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    try {
        // Fetch user's profile and enrolled courses
        const user = await User.findById(userId);
        const assessment = await Marks.findOne({ studentId: userId, courseId });

        if (!assessment) {
            return res.status(404).send({ message: 'Assessment not found for the given course' });
        }

        // Determine grade based on assessment results (e.g., Distinction, Credit, Pass, Fail)
        let grade = '';
        if (assessment.marks >= 75) grade = 'Distinction';
        else if (assessment.marks >= 55) grade = 'Credit';
        else if (assessment.marks >= 35) grade = 'Pass';
        else grade = 'Fail';

        // Generate the certificate PDF with user and assessment details
        const certificatePDF = await generateCertificatePDF(user.name, assessment.courseId.courseName, grade);

        // Send the generated PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
        res.send(certificatePDF);
    } catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).send({ message: 'Error generating certificate', error: error.message });
    }
});



export default router;
