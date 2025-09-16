// /app/cars/page.tsx
"use client";
import Link from 'next/link';
import { Car, ArrowLeft } from 'lucide-react';
import { CosmosClient } from '@azure/cosmos'; // <--- IMPORT COSMOS CLIENT

// Define a type for our car data for type safety
type CarValuation = {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  estimatedPrice: number;
  imageUrl: string;
  createdAt: string;
};

// --- DATABASE FETCHING LOGIC ---
async function getCarData(): Promise<CarValuation[]> {
  const cosmosConnectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;
  const databaseName = process.env.AZURE_COSMOS_DATABASE_NAME;
  const containerName = process.env.AZURE_COSMOS_CONTAINER_NAME;

  if (!cosmosConnectionString || !databaseName || !containerName) {
    console.error("Azure Cosmos DB credentials are not configured.");
    return []; // Return empty array if not configured
  }

  try {
    const cosmosClient = new CosmosClient(cosmosConnectionString);
    const database = cosmosClient.database(databaseName);
    const container = database.container(containerName);
    
    // Query to get all items, ordered by newest first
    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.createdAt DESC"
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    return items;
  } catch (error) {
    console.error("Failed to fetch data from Cosmos DB", error);
    return []; // Return empty array on error
  }
}


// Make the component async to use await for data fetching
export default async function CarsPage() {
  
  const cars = await getCarData();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Car className="mr-3 h-7 w-7" />
                Stored Car Valuations
            </h1>
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Estimator
            </Link>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            {cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700">No cars have been estimated yet.</h3>
                <p className="mt-2 text-gray-500">Go back to the estimator to add the first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map((car) => (
                      <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                          <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
                          <div className="p-6">
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
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}