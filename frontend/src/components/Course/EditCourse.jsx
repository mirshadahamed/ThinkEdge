import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [course, setCourse] = useState({
    courseName: '',
    courseId: '',
    courseDescription: '',
    courseAmount: '',
    courseDuration: '',
    coursePhoto: null,
    lectures: []
  });
  const [newLecture, setNewLecture] = useState({
    topic: '',
    material: null
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const transformedCourse = {
          ...response.data.course,
          lectures: response.data.course.lectures.map(lecture => ({
            topic: lecture.topicName,
            material: lecture.material,
            // Add a flag to track if material is existing (string) or new (File)
            isExistingMaterial: typeof lecture.material === 'string'
          }))
        };

        setCourse(transformedCourse);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setCourse(prev => ({
      ...prev,
      coursePhoto: e.target.files[0]
    }));
  };

  const handleLectureInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLectures = [...course.lectures];
    updatedLectures[index][name] = value;
    setCourse(prev => ({
      ...prev,
      lectures: updatedLectures
    }));
  };

  const handleLectureFileChange = (index, e) => {
    const updatedLectures = [...course.lectures];
    updatedLectures[index].material = e.target.files[0];
    setCourse(prev => ({
      ...prev,
      lectures: updatedLectures
    }));
  };

  const handleNewLectureInputChange = (e) => {
    const { name, value } = e.target;
    setNewLecture(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewLectureFileChange = (e) => {
    setNewLecture(prev => ({
      ...prev,
      material: e.target.files[0]
    }));
  };

  const addNewLecture = () => {
    if (!newLecture.topic) {
      setError('Lecture topic is required');
      return;
    }

    setCourse(prev => ({
      ...prev,
      lectures: [...prev.lectures, newLecture]
    }));

    setNewLecture({
      topic: '',
      material: null
    });
    setError('');
  };

  const removeLecture = (index) => {
  if (window.confirm('Are you sure you want to remove this lecture?')) {
    const updatedLectures = [...course.lectures];
    updatedLectures.splice(index, 1);
    setCourse(prev => ({
      ...prev,
      lectures: updatedLectures
    }));
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    // Append basic course info
    formData.append('courseName', course.courseName);
    formData.append('courseId', course.courseId);
    formData.append('courseDescription', course.courseDescription);
    formData.append('courseAmount', course.courseAmount);
    formData.append('courseDuration', course.courseDuration);

    // Append course photo if changed
    if (course.coursePhoto && typeof course.coursePhoto !== 'string') {
      formData.append('coursePhoto', course.coursePhoto);
    }

    // Prepare lectures data
    const lecturesData = course.lectures.map(lecture => ({
      topic: lecture.topic,
      material: lecture.isExistingMaterial ? lecture.material : null
    }));
    formData.append('lectures', JSON.stringify(lecturesData));

    // Append lecture files
    course.lectures.forEach((lecture, index) => {
      if (lecture.material && !lecture.isExistingMaterial) {
        formData.append(`lectures[${index}][material]`, lecture.material);
      }
    });

    // Debug: Log form data before sending
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.put(
      `http://localhost:4000/course/update/${courseId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    setSuccess('Course updated successfully!');
    setTimeout(() => navigate('/instructcourses'), 1500);
  } catch (err) {
    console.error('Error updating course:', err);
    if (err.response) {
      console.error('Server response:', err.response.data);
      setError(err.response.data.message || 'Failed to update course');
    } else {
      setError('Network error. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="courseName">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={course.courseName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="courseId">
              Course ID
            </label>
            <input
              type="text"
              id="courseId"
              name="courseId"
              value={course.courseId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="courseDescription">
            Course Description
          </label>
          <textarea
            id="courseDescription"
            name="courseDescription"
            value={course.courseDescription}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="courseAmount">
              Course Price ($)
            </label>
            <input
              type="number"
              id="courseAmount"
              name="courseAmount"
              value={course.courseAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="courseDuration">
              Course Duration
            </label>
            <input
              type="text"
              id="courseDuration"
              name="courseDuration"
              value={course.courseDuration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., 4 weeks, 30 hours"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="coursePhoto">
            Course Photo
          </label>
          <div className="flex items-center space-x-4">
            {course.coursePhoto && (
              <div className="w-32 h-32 overflow-hidden rounded-lg">
                <img
                  src={
                    typeof course.coursePhoto === 'string' 
                      ? `http://localhost:4000/public/uploads/${course.coursePhoto}`
                      : URL.createObjectURL(course.coursePhoto)
                  }
                  alt="Course preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              id="coursePhoto"
              name="coursePhoto"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lectures</h2>
          
          {course.lectures.map((lecture, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Lecture Topic</label>
                  <input
                    type="text"
                    name="topic"
                    value={lecture.topic}
                    onChange={(e) => handleLectureInputChange(index, e)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Lecture Material</label>
                  <div className="flex items-center space-x-2">
                  {lecture.material && (
                  <div className="mt-2">
                    {lecture.isExistingMaterial ? (
                      <>
                        <span className="text-sm text-gray-600">
                          Current material: {lecture.material.split('/').pop()}
                        </span>
                        <a 
                          href={`http://localhost:4000/public/uploads/${lecture.material}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline text-sm"
                        >
                          (Download)
                        </a>
                      </>
                    ) : (
                      <span className="text-sm text-gray-600">
                        New material selected: {lecture.material.name}
                      </span>
                    )}
                  </div>
                )}
                    <input
                      type="file"
                      onChange={(e) => handleLectureFileChange(index, e)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLecture(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Remove Lecture
              </button>
            </div>
          ))}

          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Lecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Lecture Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={newLecture.topic}
                  onChange={handleNewLectureInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lecture topic"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Lecture Material</label>
                <input
                  type="file"
                  name="material"
                  onChange={handleNewLectureFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addNewLecture}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Lecture
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/instructor-courses')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>

        </div>
      </form>
    </div>
  );
};

export default EditCourse;