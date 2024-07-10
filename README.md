<a name="top"></a>

# IP Address Tracker

## Overview

IP Address Tracker created to help you get the IP Address locations (using the IP Geolocation API by IPify). To generate the map, I used the Google Maps API.

## Table of contents

- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Code Quality](#code-quality)
- [Dependencies](#dependencies)
- [Author](#author)

**IMPORTANT**:

- To use the **IP Geolocation API** by **IPify**, you'll need to sign up for a free account. You won't need to add any cards details to do this and it's a very quick process.
  This will generate an API Key for you. Usually, you would be able to restrict your API Key to a specific URL (your own domain). This makes sure that other people can't use your API Key on their own websites.
  IPify doesn't have this feature.
  - Use your API key for the `VITE_GEOLOCATION_API_KEY` environment variable
- Make sure to create your own [Google Maps API key](https://developers.google.com/maps/get-started) and use this for the `VITE_GOOGLE_MAPS_API_KEY` environment variable

## Features

- **Track IP Addresses:** Enter an IP address and get detailed information and its location on Google Maps.
- **Modern UI:** Built with React and styled with TailwindCSS for a clean and responsive design.
- **Fast and Efficient:** Utilizes Vite for fast development and build processes.
- **Type Safety:** Developed using TypeScript to enhance code quality and maintainability.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

![Node](https://img.shields.io/badge/-nodejs-black?style=for-the-badge&logoColor=white&logo=node.js&color=366A31)
![PNPM](https://img.shields.io/badge/-pnpm-black?style=for-the-badge&logoColor=white&logo=pnpm&color=B76507)

- Node.js (>=14.x)
- NPM (>=6.x) or yarn (>=1.22.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shamsinator/ip-address-tracker.git
   ```

   ```
   cd ip-address-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development

To start the application in development mode with hot reloading:

```bash
npm run dev
```

This will start a local development server. Open your browser and navigate to http://localhost:3000.

### Build

To create a production build:

```bash
npm run build
```

The output will be in the dist directory.

### Preview

To preview the production build locally:

```bash
npm run preview
```

This will start a server to preview the built application.

## Code Quality

### Formatting

To format the code using Prettier:

```bash
npm run format
```

### Linting

To lint the code using ESLint:

```bash
npm run lint
```

## Dependencies

### Core Dependencies

- React: A JavaScript library for building user interfaces.
- ReactDOM: Provides DOM-specific methods for React.
- Axios: Promise-based HTTP client for the browser and Node.js.
- @vis.gl/react-google-maps: React bindings for Google Maps API.

### Development Dependencies

- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Vite: Next generation frontend tooling.
- ESLint: A tool for identifying and fixing problems in JavaScript code.
- Prettier: An opinionated code formatter.
- TailwindCSS: A utility-first CSS framework.
- dotenv: Loads environment variables from a .env file into process.env.

## Author

- Website - [shamsinator.nl](https://www.shamsinator.nl)
- Frontend Mentor - [@shamsinator](https://www.frontendmentor.io/profile/shamsinator)
- X - [@Amirsbay](https://x.com/Amirsbay)

<p align="right"><a href="#top">[Back to top]</a></p>
