## About
This project queues and POSTs requests to specified APIs converting between
URL-encoded and JSON-formatted data for API testing purposes.

## To run

In the project directory, you can run:

```
npm install
npm start
```

## Tests

Tests can be run with 

```
npm install
npm test
```

## Requirements
 - node to create the production build or to execute the `start` React script
 - You should control any API you are querying because of CORS and to not query unsuspecting APIs

## Features
 - React frontend
 - Can execute multiple requests at once
 - Can queue against multiple APIs to make requests in order
 - Stores previously-used API URLs in the browser's LocalStorage
