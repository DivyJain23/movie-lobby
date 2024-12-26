# Movie Lobby Backend


### Tech Stack
1. Node.js with express for api's
2. Mongo DB

### Prerequisites
1. GIT
2. Node: install version 20.11.1
3. NPM: install version 10.2.4 or greater
4. Mongo DB version 5
5. A clone of this repo on your local machine. Repository can be accessed from here - https://github.com/DivyJain23/movie-lobby

#### Package Installation
- `$ npm ci`

### Steps to run project:
- `$ npm run build`
- `$ npm run start`

### Environment Variables:
- The project requires environment variables to be configured. A .env.example file has been added for reference

### Setup Instructions:
1. Copy the .env.example file using this command `$ cp .env.example .env`
2. Fill in the appropriate values in the .env file.

### Features Added:
1. Postman Collection: Documentation for APIs is available via a Postman collection. You can find the collection in the /dump folder.
2. ESLint Integration: The project includes ESLint for consistent code styling and error detection. Run npm run lint to check for linting issues.
3. Caching with Redis: Redis has been integrated for caching. Ensure Redis is properly configured by setting the relevant environment variables in the .env file.
4. Test Cases: Test cases using Mocha and Chai have been added to verify the functionality of the API. The tests cover various scenarios, including get, movie search, creation, update, and deletion.

### Additional Commands:
1. Run the project in development mode: `$ npm run dev`
2. Run tests: `$ npm run test`
