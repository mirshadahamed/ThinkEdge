import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);

  const fetchCourseDetail = async () => {
    try {
      const res = await axios.get(`https://localhost:4000/course/detail/${id}`);
      setCourse(res.data.course);
      setUpdatedData(res.data.course);
    } catch (err) {
      console.error("Failed to fetch course detail:", err);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleRemoveLecture = (index) => {
    const newLectures = [...updatedData.lectures];
    newLectures.splice(index, 1);
    setUpdatedData({ ...updatedData, lectures: newLectures });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('courseId', updatedData.courseId);
      formData.append('courseName', updatedData.courseName);
      formData.append('courseDescription', updatedData.courseDescription);
      formData.append('courseAmount', updatedData.courseAmount);
      formData.append('courseDuration', updatedData.courseDuration);
      if (photoFile) formData.append('coursePhoto', photoFile);
      formData.append('lectures', JSON.stringify(updatedData.lectures));

      await axios.put(`/api/courses/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Course updated successfully!");
      setEditMode(false);
      fetchCourseDetail();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (!course) return <div className="p-8 text-center text-xl">Loading course details...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-4 flex gap-3">
        <Link to="/admin/course-list">
          <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition">Back</button>
        </Link>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        {editMode ? (
          <>
            <input type="text" name="courseId" value={updatedData.courseId} onChange={handleChange}
              className="border p-2 w-full rounded" placeholder="Course ID" />

            <input type="text" name="courseName" value={updatedData.courseName} onChange={handleChange}
              className="border p-2 w-full rounded" placeholder="Course Name" />

            <textarea name="courseDescription" value={updatedData.courseDescription} onChange={handleChange}
              className="border p-2 w-full rounded" placeholder="Description"></textarea>

            <input type="text" name="courseAmount" value={updatedData.courseAmount} onChange={handleChange}
              className="border p-2 w-full rounded" placeholder="Amount" />

            <input type="text" name="courseDuration" value={updatedData.courseDuration} onChange={handleChange}
              className="border p-2 w-full rounded" placeholder="Duration" />

            <input type="file" onChange={(e) => setPhotoFile(e.target.files[0])}
              className="border p-2 w-full rounded" />
          </>
        ) : (
          <>
            <p><strong>Course ID:</strong> {course.courseId}</p>
            <p><strong>Amount:</strong> ₹{course.courseAmount}</p>
            <p><strong>Duration:</strong> {course.courseDuration}</p>
            <p><strong>Description:</strong></p>
            <p>{course.courseDescription}</p>
            {course.coursePhoto && (
              <div className="mt-4">
                <img src={`/uploads/${course.coursePhoto}`} alt="Course" className="w-64 rounded shadow" />
              </div>
            )}
          </>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-2">Lectures</h2>
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        {editMode ? (
          updatedData.lectures.map((lecture, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <input type="text"
                value={lecture.topicName}
                onChange={(e) => {
                  const newLectures = [...updatedData.lectures];
                  newLectures[index].topicName = e.target.value;
                  setUpdatedData({ ...updatedData, lectures: newLectures });
                }}
                className="border p-2 w-1/3 rounded"
              />
              <a href={`/uploads/${lecture.material}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                {lecture.material}
              </a>
              <button onClick={() => handleRemoveLecture(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Remove</button>
            </div>
          ))
        ) : (
          course.lectures.map((lecture, idx) => (
            <div key={idx} className="flex justify-between border-b py-2">
              <span>{lecture.topicName}</span>
              <a href={`/uploads/${lecture.material}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {lecture.material}
              </a>
            </div>
          ))
        )}
      </div>

      {editMode && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition">Save</button>
          <button onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetail;
