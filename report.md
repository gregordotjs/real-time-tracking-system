# Report
Considering my familiarity with **node.js** and **express.js** framework, the backend assignment heavily relies on these technologies. 

## Service
The service is written with **express.js** framework and it has two endpoints (users, events). **Sqlite3** database is used, since it's very easy to set up for prototyping. For the manipulation with database, **knex.js** query builder is used, which also supports the creation of *migration schemes* (creating and dropping of database) and *seeding* (populate database with dummy data). Code is covered with tests as well, for which **mocha**, **chai** and **chai-http** are used. For testing of the services a separate sqlite3 database is set up and populated each time the tests run.

## PubSub
For the pub/sub mechanism the initial idea was to implement a solution that would rely solely on **socket.io** and **socket.io-client**. However, with the scaling of the application in mind, I used a redis adapter for socket.io, called **socket.io-redis**. This enables the solution to run multiple socket.io instances on different servers and they can all emit events to and from each other, in theory at least (admittedly, I haven't tested this for the sake of this assignment). So, while socket.io is used, the communication is based on the redis' pub/sub mechanism. The event is propagated from the service by using **socket.io-emitter**.

## CLI
The cli is implemented using **node.js** with **inquirer** library. It has various functionalities: users can filter events from specific accounts, or the user can select one of the existing (and active) accounts by using filter --select option. Users can also obtain a summarization report by typing summary in the cli and afterwards define the interval (in seconds). Filter or summary functionalities can be disabled at any time with --remove handle (e.g.: summary --remove). If the pub/sub mechanism is disconnected for whatever reason, CLI remembers the exact moment the disconnection occurred and when the pub/sub becomes available again, the CLI requests the backlog of all the events that occurred while the pub/sub was down (events are stored in the redis in form of sets that can be queried very easily).