// /app/api/ai-summary/route.ts

import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

export async function POST(request: Request) {
  try {
    // Parse the request body containing car details
    const carData = await request.json();
    const { brand, model, year, mileage, enpower, envolume, fuel_type, transmission, estimatedPrice } = carData;

    // Validate required fields
    if (!brand || !model || !year || !mileage || !estimatedPrice) {
      return NextResponse.json(
        { error: 'Missing required car details' },
        { status: 400 }
      );
    }

    // Check if Azure OpenAI credentials are configured
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!endpoint || !apiKey || !deploymentName) {
      console.error('Azure OpenAI credentials not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please check your Azure OpenAI settings.' },
        { status: 500 }
      );
    }

    // Initialize Azure OpenAI client
    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-08-01-preview',
      deployment: deploymentName,
    });

    // Construct the prompt with car details
    const prompt = `You are a car market expert providing brief, practical advice to potential used car buyers. Analyze the following used car and provide a concise summary (3-4 sentences maximum).

Car Details:
- Brand & Model: ${brand} ${model}
- Year: ${year}
- Mileage: ${mileage.toLocaleString()} km
- Engine: ${enpower} HP, ${envolume}L
- Fuel Type: ${fuel_type}
- Transmission: ${transmission}
- Estimated Market Price: $${estimatedPrice.toLocaleString()}

Provide a summary that includes:
1. Whether this is a good market value (considering year, mileage, and price)
2. What buyers typically appreciate about this specific model
3. One key consideration or common issue for this year/model

Keep it concise, practical, and buyer-focused. Write in a friendly, professional tone.`;

    // Call Azure OpenAI API
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable car market expert who provides concise, practical advice to used car buyers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: deploymentName,
      max_tokens: 300,
      temperature: 0.7,
    });

    // Extract the generated summary
    const summary = completion.choices[0]?.message?.content;

    if (!summary) {
      throw new Error('No summary generated from AI model');
    }

    // Return the AI-generated summary
    return NextResponse.json({
      success: true,
      summary: summary.trim(),
      model: deploymentName,
    });

  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Failed to generate AI summary';
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Unable to connect to Azure OpenAI service';
    } else if (error.status === 401) {
      errorMessage = 'Invalid Azure OpenAI API key';
    } else if (error.status === 404) {
      errorMessage = 'Azure OpenAI deployment not found';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
