# Local Restaurant Finder Backend

## Overview
The Local Restaurant Finder application is a cross-platform solution that allows users to find local restaurants using Google Maps API. This backend service is built with Node.js, Express, and MongoDB, and it serves as the API for the frontend and mobile applications.

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- Firebase
- Google Maps API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Firebase account for authentication and database services
- Google Maps API key

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/local-restaurant-finder.git
   ```
2. Navigate to the backend directory:
   ```
   cd local-restaurant-finder/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
1. Set up your MongoDB connection in `src/config/db.js`.
2. Configure Firebase in `src/config/firebase.js` with your Firebase project credentials.
3. Obtain a Google Maps API key and set it in your environment variables or directly in the `src/services/googleMapsService.js`.

### Running the Application
To start the backend server, run:
```
npm start
```
The server will run on `http://localhost:5000` by default.

### API Endpoints
- `GET /api/restaurants`: Fetch all restaurants.
- `GET /api/restaurants/:id`: Fetch a restaurant by ID.
- `GET /api/restaurants/nearby`: Find nearby restaurants based on user location.

## Deployment
For deployment, consider using services like Heroku, AWS, or DigitalOcean. Ensure that your environment variables are set correctly in the production environment.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Google Maps API for location services.
- Firebase for authentication and database services.
- Mongoose for MongoDB object modeling.