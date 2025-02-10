import React from "react";
import {useSearchParams } from "react-router-dom";
import axios from "axios";
import { Check, X } from "lucide-react";

const NectSimulation: React.FC = () => {
  const [searchParams] = useSearchParams();

  const queryParams = Object.fromEntries(searchParams.entries());

  const handleSimulateSuccess = () => {
    const code = queryParams["code"];
    axios.get(`https://shiftpen.dev.grootan.net/api/v1/nect/callback?code=${code}`)
      .then(() => {
        window.close();
      })
      .catch(error => {
        if (error.response) {
          console.error('Error Status:', error.response.status);
          console.error('Error Data:', error.response.data);
        } else if (error.request) {
          console.error('No Response Received:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }
      });
  };

  const handleSimulateFailure = () => {
    window.close();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-700 px-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-white text-2xl font-semibold">
          Sandbox identity verification
        </h1>
        <p className="text-white mt-4 text-sm">
          Since you are using the <span className="font-bold">Sandbox environment</span>,{" "}
          <span className="font-bold">video identity verification is disabled.</span> Instead, 
          you can simulate verification results directly yourself using the actions below.
        </p>
        
        <div className="mt-6 space-y-4">
          <button
            onClick={handleSimulateSuccess}
            className="flex items-center justify-center w-full py-3 rounded-full bg-green-300 text-black font-semibold text-lg shadow-md hover:bg-green-400 transition"
          >
            <Check className="w-5 h-5 mr-2" />
            Simulate success
          </button>
          <p className="text-xs text-green-200">Signer identity verified</p>

          <button
            onClick={handleSimulateFailure}
            className="flex items-center justify-center w-full py-3 rounded-full bg-white text-black font-semibold text-lg shadow-md hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 mr-2" />
            Simulate failure
          </button>
          <p className="text-xs text-gray-300">Signer identity cannot be verified</p>
        </div>
      </div>
    </div>
  );
};

export default NectSimulation;