# Local Restaurant Finder

## Overview
The Local Restaurant Finder is a cross-platform application that allows users to discover local restaurants using Google Maps API. The application is built using React for the web, React Native for mobile, and Node.js with Express for the backend. It utilizes MongoDB for data storage and Firebase for authentication and real-time data synchronization.

## Features
- Search for local restaurants based on user location.
- View restaurant details including name, cuisine, and distance from the user.
- Interactive map view to visualize restaurant locations.
- Progressive Web App (PWA) capabilities for offline access.
- SEO and Social Network Optimization friendly.

## Project Structure
```
local-restaurant-finder
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── config
│   │   └── app.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   ├── README.md
│   └── service-worker.js
├── mobile
│   ├── components
│   ├── screens
│   ├── firebase.js
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance running
- Firebase project set up

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your MongoDB and Firebase settings in `src/config/db.js` and `src/config/firebase.js`.
4. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
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
1. Navigate to the `mobile` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase in `firebase.js`.
4. Start the mobile application:
   ```
   npm start
   ```

## Usage
- Open the web application in your browser to search for local restaurants.
- Use the mobile application to find restaurants on the go.
- The application will display a list of restaurants along with their details and locations on the map.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.