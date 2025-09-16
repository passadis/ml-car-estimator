<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=azure,nextjs,typescript,react,npm,cosmos" />
  </a>
</p>

<h1 align="center">AI-Powered Car Price Estimation with Azure AutoML</h1>

## Introduction

This project showcases a modern car valuation system that leverages Azure AutoML, Next.js, and Azure Cosmos DB to create an intelligent car price estimation platform. The application allows users to upload car images, input vehicle details, and receive AI-powered price estimates while maintaining a comprehensive gallery of saved valuations with planned AI-generated summaries for each vehicle.

## Technologies Used

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS for modern responsive design
- **Backend**: Next.js API routes with Azure integrations
- **Machine Learning**: Azure AutoML for price prediction models
- **Database**: Azure Cosmos DB for storing car valuations
- **Storage**: Azure Blob Storage for car images
- **AI Features**: Azure Machine Learning endpoints for price estimation
- **Planned Enhancement**: AI-generated car summaries and market insights

## Features

- **Car Image Upload**: Secure image upload to Azure Blob Storage
- **Price Estimation**: Real-time car price prediction using Azure AutoML
- **Comprehensive Input**: Support for multiple car attributes (brand, model, year, mileage, engine specs, fuel type, transmission)
- **Valuation Gallery**: Browse and view all previously estimated cars
- **Modern UI**: Responsive design with modal dialogs and loading states
- **Data Persistence**: All estimates saved to Azure Cosmos DB
- **Planned**: AI-generated summaries for each car's market position and insights

## Architecture

The system consists of three main components:

1. **Next.js Frontend**
   - Modern React-based UI with TypeScript
   - Real-time form validation and file upload
   - Interactive gallery for viewing saved estimates
   - Modal system for enhanced user experience

2. **Azure AutoML Integration**
   - Machine learning model deployment on Azure
   - RESTful API endpoints for price prediction
   - Real-time inference with model versioning
   - Comprehensive logging and error handling

3. **Azure Cloud Storage**
   - **Cosmos DB**: NoSQL database for car valuation records
   - **Blob Storage**: Secure image storage with public access
   - **ML Endpoints**: Hosted AutoML models for predictions

## Project Structure

```
car-pricer/
├── src/
│   └── app/
│       ├── page.tsx              # Main estimation form
│       ├── cars/
│       │   └── page.tsx          # Gallery of saved estimates
│       ├── api/
│       │   ├── estimate/
│       │   │   └── route.ts      # ML prediction & data saving
│       │   └── cars/
│       │       └── route.ts      # Fetch saved estimates
│       └── components/
│           └── Modal.tsx         # Reusable modal component
├── package.json
└── README.md
```

## Setup and Deployment

### Prerequisites
- Azure subscription with the following services:
  - Azure Machine Learning workspace
  - Azure Cosmos DB account
  - Azure Blob Storage account
- Node.js 18+ and npm/yarn
- Car dataset for training AutoML models

### Azure Services Configuration

#### 1. Azure AutoML Model
- Train a regression model using your car dataset
- Deploy the model to a real-time endpoint
- Note the endpoint URL and API key

#### 2. Azure Cosmos DB
- Create a database and container
- Configure appropriate partition key and indexing

#### 3. Azure Blob Storage
- Create a container for car images
- Configure public read access for image URLs

### Environment Variables

Create a `.env.local` file in the car-pricer directory:

```env
# Azure Machine Learning
AI_ENDPOINT_URL=https://your-ml-endpoint.azureml.net/score
AZURE_ML_API_KEY=your_ml_api_key

# Azure Cosmos DB
AZURE_COSMOS_CONNECTION_STRING=your_cosmos_connection_string
AZURE_COSMOS_DATABASE_NAME=your_database_name
AZURE_COSMOS_CONTAINER_NAME=your_container_name

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_storage_connection_string
AZURE_STORAGE_BLOB_CONTAINER_NAME=your_blob_container_name
```

### Installation and Running

1. **Install Dependencies**
   ```bash
   cd car-pricer
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### POST `/api/estimate`
Processes car estimation requests with image upload and vehicle details.

**Request**: FormData with:
- `file-upload`: Car image file
- `brand`, `model`, `year`, `mileage`: Basic car info
- `enpower`, `envolume`, `fuel_type`, `transmission`: Engine specs

**Response**: 
```json
{
  "message": "Estimation successful!",
  "data": {
    "id": "uuid",
    "brand": "Toyota",
    "model": "Camry",
    "estimatedPrice": 25000,
    "imageUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET `/api/cars`
Retrieves all saved car valuations from Cosmos DB.

**Response**:
```json
{
  "items": [
    {
      "id": "uuid",
      "brand": "Toyota",
      "model": "Camry",
      "year": 2020,
      "mileage": 50000,
      "estimatedPrice": 25000,
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Data Flow

1. **User Input**: User uploads car image and fills out vehicle details
2. **Image Processing**: Image uploaded to Azure Blob Storage
3. **ML Prediction**: Vehicle data sent to Azure AutoML endpoint
4. **Data Storage**: Results saved to Cosmos DB with image URL
5. **Gallery Display**: Users can browse all saved estimates
6. **Future Enhancement**: AI summaries generated for each car

## Planned Features

- **AI Car Summaries**: Generate market insights and vehicle analysis using Azure OpenAI
- **Advanced Filters**: Filter gallery by price range, brand, year, etc.
- **Price History**: Track price trends for similar vehicles
- **Export Functionality**: Download estimates as PDF reports
- **Comparison Tool**: Side-by-side car comparisons

## Performance Considerations

- **Caching**: Implement Redis for frequently accessed data
- **Image Optimization**: Compress images before upload
- **ML Optimization**: Batch predictions for multiple cars
- **Database Indexing**: Optimize Cosmos DB queries with proper indexing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain consistent code formatting with Prettier
3. Add proper error handling for all Azure service calls
4. Update documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Azure AutoML team for the powerful machine learning platform
- Azure Cosmos DB team for the scalable NoSQL database solution
- Next.js team for the excellent React framework
- Azure Blob Storage for reliable image hosting

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Include relevant logs and error messages

---

**Built with ❤️ using Azure Cloud Services and Next.js**