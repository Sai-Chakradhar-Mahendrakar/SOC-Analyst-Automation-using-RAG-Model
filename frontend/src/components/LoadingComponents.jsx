import React from 'react';
import { Loader, CheckCircle2 } from 'lucide-react';

export const ProcessingStep = ({ title, status, step, currentStep }) => {
  const getStatusColor = () => {
    if (step < currentStep) return "text-green-400";
    if (step === currentStep) return "text-blue-400";
    return "text-gray-600";
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`transition-colors duration-300 ${getStatusColor()}`}>
        {step < currentStep ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <div className={`w-5 h-5 rounded-full border-2 ${
            step === currentStep ? 'border-blue-400 border-t-transparent animate-spin' : 'border-gray-600'
          }`} />
        )}
      </div>
      <span className={`font-medium ${getStatusColor()}`}>{title}</span>
      {status && (
        <span className="text-sm text-gray-400">({status})</span>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ fileName, currentStep }) => (
  <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
      <div className="flex justify-center mb-6">
        <Loader className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2 text-white">
        Processing {fileName}
      </h3>
      <p className="text-gray-400 text-center mb-8">
        Please wait while we analyze your security data
      </p>
      
      <div className="space-y-6">
        <ProcessingStep
          title="Uploading File"
          step={1}
          currentStep={currentStep}
        />
        <ProcessingStep
          title="Initializing RAG Model"
          step={2}
          currentStep={currentStep}
        />
        <ProcessingStep
          title="Processing Document"
          step={3}
          currentStep={currentStep}
        />
        <ProcessingStep
          title="Creating Vector Store"
          step={4}
          currentStep={currentStep}
        />
      </div>

      <div className="mt-8 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-400 transition-all duration-500"
          style={{ width: `${(currentStep - 1) * 25}%` }}
        />
      </div>
    </div>
  </div>
);