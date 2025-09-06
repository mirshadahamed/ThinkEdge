import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    assessmentLink: '',
    assessmentFile: null,
  });

  const fetchAssessment = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/assessment/${id}`);
      setAssessment(res.data.assessment);
      setFormData({
        topic: res.data.assessment.topic,
        description: res.data.assessment.description,
        assessmentLink: res.data.assessment.assessmentLink || '',
        assessmentFile: null, // fresh upload only if changed
      });
    } catch (err) {
      console.error('Error fetching assessment:', err);
      alert('Failed to fetch assessment data.');
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      assessmentFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append('topic', formData.topic);
    updatedData.append('description', formData.description);
    if (formData.assessmentLink) updatedData.append('assessmentLink', formData.assessmentLink);
    if (formData.assessmentFile) updatedData.append('assessmentFile', formData.assessmentFile);

    try {
      await axios.put(`http://localhost:4000/assessment/update/${id}`, updatedData);
      alert('Assessment updated successfully!');
      navigate('/your-assessments');
    } catch (err) {
      console.error('Error updating assessment:', err);
      alert('Failed to update assessment.');
    }
  };

  if (!assessment) return <p className="p-6">Loading assessment details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Assessment</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Topic */}
        <div>
          <label className="block mb-1 font-medium">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Assessment Link */}
        <div>
          <label className="block mb-1 font-medium">Assessment Link (optional)</label>
          <input
            type="url"
            name="assessmentLink"
            value={formData.assessmentLink}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block mb-1 font-medium">Upload New PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Assessment
        </button>
      </form>
    </div>
  );
};

export default EditAssessmentForm;
