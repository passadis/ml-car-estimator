// /app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

export async function GET() {
  try {
    const cosmosClient = new CosmosClient(process.env.AZURE_COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE_NAME!);
    const container = database.container(process.env.AZURE_COSMOS_CONTAINER_NAME!);
    
    const querySpec = { query: "SELECT * FROM c ORDER BY c.createdAt DESC" };
    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch car data' }, { status: 500 });
  }
}