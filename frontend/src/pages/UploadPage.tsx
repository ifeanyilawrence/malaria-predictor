/*
  ============================================================================
  This project was developed as part of a research dissertation:

  Title: Design and Implementation of a Convolutional Neural Network for Malaria Diagnosis:
         Image-Based Classification of Uninfected and Infected Blood Cells
  Author: Lawrence Ifeanyi Eze
  Degree: Master of Science
  Institution: University of East London
  Year: 2025

  Model Source Code: https://github.com/ifeanyilawrence/malaria-classifier
  ============================================================================
*/

import React, { useState } from "react";

const API_URL = "https://malaria-predictor-api.ifeanyilawrence.com/predict"; // Update if deploying backend elsewhere

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    setError(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setResult(data.result);
      setConfidence(data.confidence);
      setShowModal(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setConfidence(null);
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="mb-6 w-full max-w-md">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded shadow animate-fade-in">
          <h2 className="font-bold text-blue-800 text-lg mb-1">Research Project</h2>
          <div className="text-sm text-gray-700">
            <div><span className="font-semibold">Title:</span> Design and Implementation of a Convolutional Neural Network for Malaria Diagnosis: Image-Based Classification of Uninfected and Infected Blood Cells</div>
            <div><span className="font-semibold">Author:</span> Lawrence Ifeanyi Eze</div>
            <div><span className="font-semibold">Degree:</span> Master of Science</div>
            <div><span className="font-semibold">Institution:</span> University of East London</div>
            <div><span className="font-semibold">Year:</span> 2025</div>
            <div><span className="font-semibold">Model Source Code:</span> <a href="https://github.com/ifeanyilawrence/malaria-classifier" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">github.com/ifeanyilawrence/malaria-classifier</a></div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Malaria Cell Image Prediction</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-200 animate-fade-in"
          />
        )}
        {error && <div className="text-red-500 animate-shake">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Predicting...
            </span>
          ) : (
            "Predict Malaria"
          )}
        </button>
      </form>
      {showModal && result && confidence !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md animate-fade-in relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Prediction Result</h1>
            <div className={`text-3xl font-semibold ${result === "Uninfected" ? "text-green-600" : "text-red-600"} animate-bounce`}>{result}</div>
            <div className="text-lg text-gray-700">Confidence: <span className="font-mono">{(confidence * 100).toFixed(2)}%</span></div>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Try Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
