import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({

    
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        include:'@'
    },

    role: { 
        type: String, 
        enum: ["student", "instructor", "admin"],
        required: true 
    },

    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], 


});

const User = mongoose.model("User",userSchema);

export default User