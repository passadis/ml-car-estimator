// /app/cars/page.tsx

"use client"; 

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { Car, ArrowLeft, BrainCircuit } from 'lucide-react'; 
import Modal from '../components/Modal';



// Define a type for our car data for type safety
type CarValuation = {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  enpower: number;
  envolume: number;
  fuel_type: string;
  transmission: string;
  estimatedPrice: number;
  imageUrl: string;
  createdAt: string;
};


export default function CarsPage() {
  const [cars, setCars] = useState<CarValuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // Fetch data on component mount
    async function fetchData() {
      try {
        const response = await fetch('/api/cars'); 
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        setCars(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  
  // Function to handle the AI summary button click
  const handleSummaryClick = (car: CarValuation) => {
    setModalContent(
      <div>
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <BrainCircuit className="mr-2 text-indigo-600" />
            AI Summary for {car.brand} {car.model}
        </h3>
        <p className="mt-4 text-gray-600">
            This is a mock AI-generated summary. In the future, this text will be created by a generative AI model, providing a quick overview of the car's market position, common praise, and potential issues based on its model, year, and mileage.
        </p>
      </div>
    );
    setIsModalOpen(true);
  };


  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
      </Modal>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Car className="mr-3 h-7 w-7" />
                Stored Car Valuations
            </h1>
             <div className="flex justify-center mb-6">
            <img src="./logo1.JPG" alt="Logo" className="h-16 w-auto" />
          </div>
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Estimator
            </Link>
        </div>
      </header>
        <main>
          <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            {isLoading ? <p>Loading cars...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
                    <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h2>
                              <p className="text-sm text-gray-500 mt-1">{car.year}</p>
                              
                              <div className="mt-4 flex justify-between items-end">
                                  <div className="text-left">
                                      <p className="text-xs text-gray-500">Mileage</p>
                                      <p className="text-md font-semibold text-gray-800">{car.mileage.toLocaleString()} km</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-xs text-gray-500">Estimated Price</p>
                                      <p className="text-lg font-bold text-green-600">${car.estimatedPrice.toLocaleString()}</p>
                                  </div>
                              </div>
                      <div className="flex-grow"></div> {/* Pushes button to the bottom */}
                      {/* vvv NEW BUTTON HERE vvv */}
                      <button
                        onClick={() => handleSummaryClick(car)}
                        className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <BrainCircuit className="mr-2 h-5 w-5 text-indigo-500" />
                        Get AI Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}