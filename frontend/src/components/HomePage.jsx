import React, { useState, useCallback } from "react";
import { Upload, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./LoadingComponents";
import { CustomAlert } from "./CustomAlert";
// import { useLogData } from "./LogDataContext";
// import { useProcessing } from "../context/ProcessingContext";
// import { useHistoryManager } from './HistoryManager';

const HomePage = () => {
  // const { addToHistory } = useHistoryManager();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // const { processLogFile } = useLogData();
  // const { startProcessing, processingState } = useProcessing();
  // const { isProcessing, curStep, err, done } = processingState;

  const acceptedFileTypes = [".csv", ".log", ".txt", ".md"];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file) => {
    const extension = "." + file.name.split(".").pop().toLowerCase();
    if (!acceptedFileTypes.includes(extension)) {
      setError(
        "Invalid file type. Please upload CSV, LOG, TXT, or MD files only."
      );
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size too large. Please upload files under 10MB.");
      return false;
    }
    return true;
  };

  const simulateProcessingSteps = async () => {
    setCurrentStep(1); // Uploading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCurrentStep(2); // Initializing RAG
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setCurrentStep(3); // Processing Document
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setCurrentStep(4); // Creating Vector Store
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const uploadFile = async (file) => {
    try {
      // const success = await startProcessing(file);

      if (true) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          setIsUploading(true);
          setError("");
          setSuccess("");

          // Start processing animation
          // await processLogFile(file);

          simulateProcessingSteps();

          const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          // addToHistory(file);
          if (data.message.includes("successfully processed")) {
            setSuccess(
              "File processed successfully! RAG model is ready for queries."
            );
            // Wait for state updates to complete
            setTimeout(() => {
              navigate("/chat", { state: { fileName: file.name } });
            }, 1000);
          }
        } catch (err) {
          setError(`Upload failed: ${err.message}`);
          setFile(null);
        } finally {
          setTimeout(() => {
            setIsUploading(false);
            setCurrentStep(0);
          }, 1000);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError("");
    setSuccess("");

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      uploadFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    setError("");
    setSuccess("");
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      {isUploading && (
        <LoadingOverlay fileName={file?.name} currentStep={currentStep} />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Cybersecurity SOC Analyst Automation
          </h1>
          <p className="text-xl text-gray-300">
            Upload your security logs and documents for intelligent analysis
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-4 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out mb-8 
            ${
              isDragging
                ? "border-blue-400 bg-blue-400/10"
                : "border-gray-600 hover:border-gray-500"
            }
            ${file && !error ? "bg-green-400/10 border-green-400" : ""}
            ${isUploading ? "pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(",")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-4">
            {file && !error ? (
              <>
                <FileText className="w-16 h-16 text-green-400" />
                <p className="text-lg font-medium text-green-400">
                  {file.name}
                </p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400" />
                <p className="text-xl font-medium">
                  Drop your file here or click to upload
                </p>
                <p className="text-gray-400">
                  Accepted formats: CSV, LOG, TXT, MD (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && <CustomAlert message={error} type="error" />}
        {success && navigate("/chat")}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: "Smart Log Insights",
              description:
                "AI-powered tool for querying and analyzing security logs.",
            },
            {
              title: "SOC Insights Engine",
              description:
                "AI-powered RAG model for fast and accurate SOC log analysis",
            },
            {
              title: "Secure Handling",
              description: "Your data is processed securely and never stored",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-blue-400 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
