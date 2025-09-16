import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { CosmosClient } from "@azure/cosmos";

export async function POST(request: Request) {
  try {
    // Debug: Log environment variables (remove in production)
    console.log("Environment check:");
    console.log("AZURE_STORAGE_CONNECTION_STRING:", process.env.AZURE_STORAGE_CONNECTION_STRING ? "SET" : "MISSING");
    console.log("AZURE_STORAGE_BLOB_CONTAINER_NAME:", process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME ? "SET" : "MISSING");
    console.log("AI_ENDPOINT_URL:", process.env.AI_ENDPOINT_URL ? "SET" : "MISSING");
    console.log("AZURE_ML_API_KEY:", process.env.AZURE_ML_API_KEY ? "SET" : "MISSING");
    console.log("AZURE_COSMOS_CONNECTION_STRING:", process.env.AZURE_COSMOS_CONNECTION_STRING ? "SET" : "MISSING");
    
    // --- 1. PARSE FORM DATA (No changes) ---
    const formData = await request.formData();
    const file = formData.get('file-upload') as File;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const mileage = formData.get('mileage') as string;
    const enpower = formData.get('enpower') as string;
    const envolume = formData.get('envolume') as string;
    const fuel_type = formData.get('fuel_type') as string;
    const transmission = formData.get('transmission') as string;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    // --- 2. UPLOAD IMAGE TO AZURE BLOB STORAGE (No changes) ---
    console.log("Step 2: Uploading to Azure Blob Storage...");
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
    // ... (rest of blob logic is the same)
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME!);
    const blobName = `${uuidv4()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(buffer, buffer.length);
    const imageUrl = blockBlobClient.url;
    console.log("Step 2: Blob upload successful, URL:", imageUrl);

    // ==================================================================
    // --- 3. CALL REAL AZURE ML ENDPOINT ---
    // ==================================================================
    console.log("Step 3: Calling Azure ML endpoint...");
    const endpointUrl = process.env.AI_ENDPOINT_URL;
    const apiKey = process.env.AZURE_ML_API_KEY;

    if (!endpointUrl || !apiKey) {
      console.error("Azure ML credentials missing:", { endpointUrl: !!endpointUrl, apiKey: !!apiKey });
      throw new Error("Azure ML endpoint credentials are not configured.");
    }

    // Construct the request body exactly as the model schema requires.
    const requestBody = {
      input_data: {
        columns: ["id", "brand", "model", "mileage", "year", "enpower", "envolume", "fuel_type", "transmission"],
        data: [
          [
            0, // A dummy 'id' as it's in the schema but not our form
            brand,
            model,
            parseInt(mileage),
            parseInt(year),
            parseInt(enpower),
            parseInt(envolume),
            fuel_type,
            transmission
          ],
        ],
      },
    };

    // Set up the required headers.
    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "azureml-model-deployment": "carmodeldata1-1", // As specified in your consume script
    });

    console.log("Calling Azure ML endpoint with body:", JSON.stringify(requestBody, null, 2));

    const mlResponse = await fetch(endpointUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
    });

    if (!mlResponse.ok) {
      const errorBody = await mlResponse.text();
      console.error("Azure ML request failed:", mlResponse.status, mlResponse.statusText, errorBody);
      throw new Error(`Request to AI model failed with status ${mlResponse.status}: ${errorBody}`);
    }

    const predictionResult = await mlResponse.json();
    console.log("Received prediction from Azure ML:", predictionResult);
    console.log("Step 3: ML prediction successful");

    // IMPORTANT: Adjust this line based on the actual JSON output of your model.
    // It's often an array with a single prediction.
    const estimatedPrice = Math.round(predictionResult[0]); 
    // ==================================================================

    // --- 4. SAVE TO COSMOS DB (No changes) ---
    console.log("Step 4: Saving to Cosmos DB...");
    const cosmosClient = new CosmosClient(process.env.AZURE_COSMOS_CONNECTION_STRING!);
    // ... (rest of cosmos db logic is the same)
    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE_NAME!);
    const container = database.container(process.env.AZURE_COSMOS_CONTAINER_NAME!);

    const carData = {
      id: uuidv4(),
      brand,
      model,
      fuel_type,
      transmission,
      enpower: parseInt(enpower),
      envolume: parseInt(envolume),
      year: parseInt(year),
      mileage: parseInt(mileage),
      estimatedPrice,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    
    await container.items.create(carData);
    console.log(`Step 4: Successfully saved car data with REAL price to Cosmos DB.`);


    // --- 5. RETURN SUCCESS RESPONSE (No changes) ---
    return NextResponse.json({ 
        message: "Estimation successful!",
        data: carData
    }, { status: 200 });

  } catch (error) {
    console.error("Error in estimation process:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to process estimation.", details: errorMessage }, { status: 500 });
  }
}