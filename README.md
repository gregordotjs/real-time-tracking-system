# Real time tracking system

## Running the application
1. Clone the repository and when in project folder, and run **npm i**
1. Create the database with **npm run create** and seed it with dummy data (**npm run seed**).
1. Run the Redis server; for Windows 10, [Redis standalone](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504) is enough.
1. When Redis server is running, start the service with **npm run start** (it will run the nodemon).
1. PubSub can be started with **npm run start-pubsub**.
1. Finally, start CLI with **npm run start-cli** and type *help* for more information.

Open postman (or browser) and execute GET, e.g. *http://localhost:3000/api/v1/events/5?data=some-random-event*. The CLI should receive the event. 

## Running the tests
Follow the first 3 steps, then run either
1. **npm run test** for testing of the service or
1. **npm run test-socket** for testing of the pubsub and CLI