Redis as solution for EventBus aka Queue Management aka Messages Broker
===

## Docker (part 1)

- `docker run --name redis-container -p 6379:6379 -d redis`
- `docker run --name RedisContainer -p 6379:6379 -d redis`
- `docker run --name for-microservices-redis-container -d -v redis_data:/data redis`


## Local: run NodeJS servers

CLI/Terminal 1: `cd a_service && run startWithRedis` => http://localhost:3001/
CLI/Terminal 2: `cd b_service && run startWithRedis` => http://localhost:3002/
CLI/Terminal 3: `cd app_server && run startWithRedis` => http://localhost:3000/indexWithRedis.html


## Patterns info

localhost:3000/client.html => Fetch API => POST /postData 
- => localhost:3000/server.js => Axios POST =>
  - POST localhost:3001/createAData
  - POST localhost:3002/createBData

ChatGPT:

> Implemented code follows a common microservices pattern known as the "Event Sourcing" pattern, combined with elements of the "Command Query Responsibility Segregation" (CQRS) pattern.

Note. More about CQRS here: https://github.com/alundiak/showcases/tree/main/CQRS

- events (or messages) are used as a means of communication between components (Service A, Service B, and ServerApp).
- Events are stored in a Redis list (dataList) and represent changes in the system's state. Each event contains a message.
- Although not explicitly stated, there's a separation between the command side (which handles the creation of events) and the query side (which reads and processes events).
- The client (ServerApp) sends a command (POST request with data) to the server. The server then generates an event and forwards it to both Service A and Service B.
- Each service (Service A and Service B) is responsible for handling and processing the events on its own, performing the necessary actions based on the received events.
