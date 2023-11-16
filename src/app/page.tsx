/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react";

export default function Home() {
  interface DescriptionOfTheAttack {
    natureOfTheAttack: string;
    commonTechniques: string;
  }

  interface RiskClassification {
    threatLevel: string;
    potentialImpact: string;
    targetedEntities: string;
  }

  interface MitigationTips {
    generalPractices: string;
    technicalMeasures: string;
    responseStrategies: string;
  }

  interface AnalysisResult {
    descriptionOfTheAttack: DescriptionOfTheAttack;
    riskClassification: RiskClassification;
    mitigationTips: MitigationTips;
  }


  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState("");

  // Event handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileUpload(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    // setIsLoading(true);
    setFile(selectedFile);
    setImageSrc(""); // Clear any existing image on the UI.

    try {
      const base64 = await toBase64(selectedFile);
      setImageSrc(base64 as string); // Show preview of the image.
    } catch (error) {
      console.error('Error during file conversion:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const toBase64 = (file: File) => new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleDetect = async () => {
    if (!file) {
      alert('Please upload an image first.');
      return;
    }

    setIsLoading(true);

    try {
      const base64 = await toBase64(file);
      setImageSrc(base64 as string);

      const payload = JSON.stringify({ photo: base64 });

      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      if (response.body) {
        const reader = response.body.getReader();
        let receivedLength = 0;
        let chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
          receivedLength += value.length;
        }

        let chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
          chunksAll.set(chunk, position);
          position += chunk.length;
        }

        let resultText = new TextDecoder("utf-8").decode(chunksAll);
        let resultJSON = JSON.parse(resultText);

        setResult(resultJSON);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dragOverClass = dragging ? "border-blue-500 bg-blue-100" : "border-gray-300";

  return (
    <div className="min-h-screen flex flex-col justify-center p-4">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">👨‍💻 HackType</h2>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 mb-4">
            Let AI be your vulnerability detective 🕵️‍♀️
          </h1>
          <p className="text-gray-700 mb-4 text-center">
            HackType is a tool that will help you identify the type of attacks, their risks and how to prevent them.
          </p>
          <p className="text-gray-700 mb-4 text-center">
            Powered by OpenAI&apos;s GPT-4 Vision API
          </p>

          <div
            className={`flex flex-col items-center justify-center p-24 border-2 border-dashed rounded-lg cursor-pointer ${dragOverClass}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              name="file"
              id="file"
              className="hidden"
              onChange={handleChange}
            />
            <label
              htmlFor="file"
              className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer"
            >
              <span className="mt-2 text-base text-center leading-normal">
                Click to upload or drag and drop
              </span>
              <p className="text-xs text-center">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>

          <button
            onClick={handleDetect}
            className={`mt-4 w-full p-2 rounded-lg font-semibold flex justify-center items-center transition-colors 
            ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Detect'
            )}
          </button>




          {imageSrc && (
            <div className="mt-4">
              <img src={imageSrc} alt="Uploaded Attack" className="mx-auto rounded-lg" />
            </div>
          )}
          {result && (
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold">Analysis Result:</h3>
              <div className="mt-2">
                <div className="bg-white shadow overflow-hidden border-2 border-zinc-200 rounded-md">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Description of the Attack
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Nature of the Attack
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.descriptionOfTheAttack.natureOfTheAttack}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Common Techniques
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.descriptionOfTheAttack.commonTechniques}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <hr />
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Risk Classification
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Threat Level
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.riskClassification.threatLevel}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Potential Impact
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.riskClassification.potentialImpact}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Targeted Entities
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.riskClassification.targetedEntities}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="border-t border-gray-200">
                    <h3 className="px-4 py-5 text-lg leading-6 font-medium text-gray-900 sm:px-6">
                      Mitigation Tips
                    </h3>
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          General Practices
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.mitigationTips.generalPractices}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Technical Measures
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.mitigationTips.technicalMeasures}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Response Strategies
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {result.mitigationTips.responseStrategies}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
