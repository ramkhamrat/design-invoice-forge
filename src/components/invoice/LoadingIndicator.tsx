
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Loading invoice template..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-invoice-accent mx-auto mb-4"></div>
        <p className="text-invoice-text-dark">{message}</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
