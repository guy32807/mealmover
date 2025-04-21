# Local Restaurant Finder

## Overview
The Local Restaurant Finder is a cross-platform application designed to help users discover local restaurants. The application utilizes the Google Maps API to provide users with information about nearby restaurants, including their locations and distances from the user's current location. The project is built using React for the web frontend, React Native for mobile, and Node.js with Express for the backend. It also incorporates MongoDB for data storage and Firebase for authentication and real-time data.

## Features
- Search for local restaurants using the Google Maps API.
- View detailed information about each restaurant, including name, cuisine, and location.
- Interactive map view to visualize restaurant locations.
- Responsive design for both web and mobile platforms.
- Progressive Web App (PWA) capabilities for offline access and improved performance.
- SEO and Social Network Optimization friendly.

## Technologies Used
- **Frontend**: React, React Router, Axios
- **Mobile**: React Native
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Firebase
- **API**: Google Maps API
- **PWA**: Service Workers

## Setup Instructions

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance running (local or cloud).
- Firebase project set up for authentication.

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd local-restaurant-finder/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your MongoDB connection in `src/config/db.js`.
4. Set up Firebase in `src/config/firebase.js`.
5. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd local-restaurant-finder/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase in `src/firebase.js`.
4. Start the React application:
   ```
   npm start
   ```

### Mobile Setup
1. Navigate to the `mobile` directory:
   ```
   cd local-restaurant-finder/mobile
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase in `firebase.js`.
4. Run the mobile application:
   ```
   npm start
   ```

## Contribution
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Google Maps API for providing location services.
- Firebase for authentication and real-time database capabilities.
- MongoDB for data storage.