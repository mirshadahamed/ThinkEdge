import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const AddCourseForm = () => {
  const [course, setCourse] = useState({
    courseId: "",
    courseName: "",
    coursePhoto: null,
    courseAmount: "",
    courseDescription: "",
    courseDuration: "",
  });

  const [lectures, setLectures] = useState([]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCourseChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCourse({ ...course, [name]: files[0] });
      if (name === "coursePhoto") {
        const fileReader = new FileReader();
        fileReader.onload = () => setPreview(fileReader.result);
        fileReader.readAsDataURL(files[0]);
      }
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const addLecture = () => {
    setLectures([...lectures, { topicName: "", material: null }]);
  };

  const handleLectureChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedLectures = [...lectures];
    updatedLectures[index][name] = files ? files[0] : value;
    setLectures(updatedLectures);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!course.courseId) newErrors.courseId = "Course ID is required";
    if (!course.courseName) newErrors.courseName = "Course Name is required";
    if (!course.courseAmount) newErrors.courseAmount = "Amount is required";
    if (!course.courseDescription)
      newErrors.courseDescription = "Description is required";
    if (!course.courseDuration)
      newErrors.courseDuration = "Duration is required";
    if (!course.coursePhoto) newErrors.coursePhoto = "Course photo is required";

    lectures.forEach((lecture, i) => {
      if (!lecture.topicName)
        newErrors[`topicName_${i}`] = "Topic Name is required";
      if (!lecture.material)
        newErrors[`material_${i}`] = "Material file is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("You need to be logged in to add a course");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const decoded = jwtDecode(authToken);
      const formData = new FormData();
      
      // Add course data
      formData.append("userId", decoded.id);
      formData.append("courseId", course.courseId);
      formData.append("courseName", course.courseName);
      formData.append("courseAmount", course.courseAmount);
      formData.append("courseDescription", course.courseDescription);
      formData.append("courseDuration", course.courseDuration);
      formData.append("coursePhoto", course.coursePhoto);
  
      // Add lectures data - fixed implementation
      lectures.forEach((lecture, index) => {
        formData.append(`lectures[${index}].topicName`, lecture.topicName);
        formData.append(`lectures[${index}].material`, lecture.material);
      });
  
      const res = await axios.post("http://localhost:4000/course/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${authToken}`
        },
      });
  
      console.log("Response from backend:", res.data);
      alert("Course added successfully!");
      
      // Reset form
      setCourse({
        courseId: "",
        courseName: "",
        coursePhoto: null,
        courseAmount: "",
        courseDescription: "",
        courseDuration: "",
      });
      setLectures([]);
      setPreview(null);
    } catch (err) {
      console.error("Failed to submit course:", err);
      alert(`Failed to add course: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="courseId"
              value={course.courseId}
              onChange={handleCourseChange}
              placeholder="Course ID"
              className="border p-2 rounded w-full"
            />
            {errors.courseId && (
              <p className="text-red-500 text-sm">{errors.courseId}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="courseName"
              value={course.courseName}
              onChange={handleCourseChange}
              placeholder="Course Name"
              className="border p-2 rounded w-full"
            />
            {errors.courseName && (
              <p className="text-red-500 text-sm">{errors.courseName}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              name="coursePhoto"
              onChange={handleCourseChange}
              className="border p-2 rounded w-full"
              accept="image/*"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Course Preview"
                className="mt-2 h-28 rounded shadow"
              />
            )}
            {errors.coursePhoto && (
              <p className="text-red-500 text-sm">{errors.coursePhoto}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="courseAmount"
              value={course.courseAmount}
              onChange={handleCourseChange}
              placeholder="Course Amount"
              className="border p-2 rounded w-full"
            />
            {errors.courseAmount && (
              <p className="text-red-500 text-sm">{errors.courseAmount}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="courseDuration"
              value={course.courseDuration}
              onChange={handleCourseChange}
              placeholder="Course Duration (e.g. 4 weeks)"
              className="border p-2 rounded w-full"
            />
            {errors.courseDuration && (
              <p className="text-red-500 text-sm">{errors.courseDuration}</p>
            )}
          </div>
        </div>
        <div>
          <textarea
            name="courseDescription"
            value={course.courseDescription}
            onChange={handleCourseChange}
            placeholder="Course Description"
            className="border p-2 rounded w-full h-24"
          ></textarea>
          {errors.courseDescription && (
            <p className="text-red-500 text-sm">{errors.courseDescription}</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Lecture Topics & Materials
          </h3>
          <table className="w-full border text-sm text-left text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Topic Name</th>
                <th className="border p-2">Material (PDF/PPT)</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="topicName"
                      value={lecture.topicName}
                      onChange={(e) => handleLectureChange(index, e)}
                      placeholder="Topic Name"
                      className="border p-1 rounded w-full"
                    />
                    {errors[`topicName_${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`topicName_${index}`]}
                      </p>
                    )}
                  </td>
                  <td className="border p-2">
                    <input
                      type="file"
                      name="material"
                      onChange={(e) => handleLectureChange(index, e)}
                      className="border p-1 rounded w-full"
                      accept=".pdf,.ppt,.pptx"
                    />
                    {errors[`material_${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`material_${index}`]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addLecture}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add Lecture
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;