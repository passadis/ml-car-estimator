// /app/page.tsx

"use client"; // This is a client component to allow for state and interactivity

import { useState } from 'react';
import type { NextPage } from 'next';
import { Car, Upload, AlertTriangle, Gauge, PartyPopper, Eye, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/app/components/Modal'; // Import the Modal component

const Home: NextPage = () => {
  // State to hold the selected file for preview
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- State for modal visibility
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Handle file selection and create a preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  // Get the current year for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!file) {
      // Use our new modal for errors too!
      setModalContent(
        <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-xl font-semibold text-gray-800">Error</h3>
            <p className="mt-2 text-gray-600">Please upload a photo of the car before estimating.</p>
        </div>
      );
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append('file-upload', file);

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      const price = result.data.estimatedPrice;
      // --- SET SUCCESS MODAL CONTENT ---
      setModalContent(
        <div className="text-center">
            <PartyPopper className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-2xl font-bold text-gray-900">Estimation Complete!</h3>
            <p className="mt-2 text-gray-600">Our AI model has estimated the value of your car at:</p>
            <p className="my-4 text-4xl font-extrabold text-gray-800">${price.toLocaleString()}</p>
        </div>
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
       // --- SET ERROR MODAL CONTENT ---
      setModalContent(
        <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-xl font-semibold text-gray-800">Estimation Failed</h3>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
        </div>
      );
    } finally {
      setIsLoading(false);
      setIsModalOpen(true); // <-- OPEN THE MODAL
    }
  };

  return (
    <> {/* Use a Fragment to wrap the page and the modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Information & Branding */}
        <div className="w-full md:w-1/3 bg-blue-900 text-white p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Car className="mr-3 h-8 w-8" />
              AutoValue AI
            </h1>
            <p className="mt-4 text-gray-300">
              Get an instant, data-driven price estimate for your used car. Fast, simple, and accurate.
            </p>
             <Link href="/cars" className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition-colors">
                <Eye className="mr-2 h-5 w-5" />
                See Stored Cars
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
             <p className="text-sm font-medium text-gray-400">Powered by Azure AI</p>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full md:w-2/3 p-8">
                  {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <img src="./logo1.JPG" alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter Your Car's Details</h2>

          {/* <form className="space-y-6" onSubmit={(e) => e.preventDefault()}> */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                <div className="mt-1 relative">
                   <Car className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                   <select id="brand" name="brand" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Select Brand</option>
                      <option>Toyota</option>
                      <option>Ford</option>
                      <option>Honda</option>
                      <option>BMW</option>
                      <option>Mercedes-Benz</option>
                      <option>Audi</option>
                      <option>Volkswagen</option>
                      <option>Hyundai</option>
                      <option>Kia</option>
                      <option>Nissan</option>
                      <option>Chevrolet</option>
                      <option>Subaru</option>
                      <option>Mazda</option>
                      <option>Volvo</option>
                      <option>Opel</option>
                      <option>Fiat</option>
                   </select>
                </div>
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                 <div className="mt-1 relative">
                   <Car className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                   <input type="text" name="model" id="model" placeholder="e.g., Camry" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                 </div>
              </div>

              {/* Year */}
               <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                 <div className="mt-1 relative">
                    <Calendar className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                    <select id="year" name="year" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Select Year</option>
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                 </div>
              </div>

              {/* Mileage */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage (km)</label>
                <div className="mt-1 relative">
                  <Gauge className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input type="number" name="mileage" id="mileage" placeholder="e.g., 50000" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            

            {/* Engine Volume */}
              <div>
                <label htmlFor="Engine Vol" className="block text-sm font-medium text-gray-700">Engine Volume</label>
                <div className="mt-1 relative">
                  <Gauge className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input type="number" name="envolume" id="envolume" placeholder="e.g., 2000" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
               
              {/* Engine Power */}
              <div>
                <label htmlFor="Engine Pw" className="block text-sm font-medium text-gray-700">Engine Power</label>
                <div className="mt-1 relative">
                  <Gauge className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input type="number" name="enpower" id="enpower" placeholder="e.g., 100" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>   
              
              {/* Fuel Type */}
              <div>
                <label htmlFor="Fuel Type" className="block text-sm font-medium text-gray-700">Fuel</label>
                <div className="mt-1 relative">
                  <Gauge className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="fuel_type" id="fuel_type" placeholder="e.g., diesel" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div> 

              {/* Transmission Type */}
              <div>
                <label htmlFor="Transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
                <div className="mt-1 relative">
                  <Gauge className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="transmission" id="transmission" placeholder="e.g., auto" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div> 
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload a Photo</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {filePreview ? (
                  <div className="relative group">
                    <img src={filePreview} alt="Car preview" className="h-40 rounded-md" />
                    <button 
                      onClick={() => { setFile(null); setFilePreview(null); }} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Click to upload</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:bg-gray-400 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Estimating...
                  </>
                ) : (
                  'Get Price Estimate'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
    </>
  );
};

export default Home;