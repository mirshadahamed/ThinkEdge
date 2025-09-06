import express from "express"; 
import cors from "cors"; 
import dotenv from "dotenv";
import mongoose from "mongoose"; 
import userRouter from "./routes/userRoutes.js";
import course from "./controllers/courseController.js"
import Assessment from './controllers/AssesmentController.js';
import Payment from "./controllers/PaymentController.js";
import Submission from "./controllers/SubmissionController.js";
import Progress from "./controllers/ProgressController.js";


dotenv.config();

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

const uri = process.env.MONGODB_URI; 

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });


const port = process.env.PORT || 4000; 


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


app.get("/", (req, res) => {
    res.send("Welcome to the API");
});


app.use("/api/users", userRouter); 
app.use("/course",course)
app.use("/assessment", Assessment);
app.use("/payment",Payment);
app.use("/submission",Submission);
app.use("/progress",Progress);

app.use('/uploads', express.static('uploads'));
app.use('/public/uploads', express.static('public/uploads'));

