MicroServices Experiments
===

Intention of this repo is purely educational. I do experiment with different micro-services setup. And I plan at least to use GitHub Actions for deployment.

This code extracted from another repo [showcases](https://github.com/alundiak/showcases/tree/main/SOA) where I initially planned to extend a "SOA" information. But MicroServices as a topic becomes wider, and so caused a dedicated repo.

## SOA => Microservices

> Microservices architecture is made up of very small and completely independent software components, called microservices, that specialize and focus on one task only. Microservices communicate through APIs, which are rules that developers create to let other software systems communicate with their microservice.


> Microservices architecture is an evolution of the SOA architectural style. Microservices address the shortcomings of SOA to make the software more compatible with modern cloud-based enterprise environments. They are fine grained and favor data duplication as opposed to data sharing. This makes them completely independent with their own communication protocols that are exposed through lightweight APIs. It’s essentially the consumers' job to use the microservice through its API, thus removing the need for a centralized ESB.


> AWS is a great place to build modern applications with modular architectural patterns, serverless operational models, and agile development processes. It offers the most complete platform for building highly available microservices to power modern applications of any scope and scale. For example, you can do the following:

• Build, isolate, and run secure microservices in managed containers to simplify operations and reduce management overhead.
• Use AWS Lambda to run your microservices without provisioning and managing servers.
• Choose from 15 relational and non-relational purpose-built AWS databases to support microservices architecture.
• Easily monitor and control microservices running on AWS with AWS App Mesh.
• Monitor and troubleshoot complex microservice interactions with AWS X-Ray.


## MicroServices info

- https://blog.logrocket.com/building-microservices-node-js/
- https://radixweb.com/blog/building-microservices-with-node-js#Reasons

- https://fauna.com/blog/how-to-build-microservices-with-node-js

Node.js has become a popular language for enterprises and startups who want to embrace microservices. There are several reasons why:

- Improved execution time - The V8 JavaScript engine that powers Node.js compiles functions written in JavaScript to native machine code. This makes Node.js a popular choice for building microservices that carry out low-latency CPU and IO-intensive operations.
- Event-driven architecture - Most of the objects in Node.js provide a way to emit and listen to events making it highly beneficial in building event-driven apps.
- Asynchronous and non-batch - Most Node.js libraries support non-blocking calls which continue execution without waiting for the previous call to return. Additionally, data is returned as-is, streamed as chunks, and not batched in a buffer.
- Scalable technology - The Node.js execution model supports scaling by delegating request handling to other worker threads.


## Frequently related questions

Questions from Java developer friend:

- what is Saga pattern? 
- what is event sourcing? 
- what is CQRS? 
- How do we make transactions in microservices architecture?


Book "Microservice Patterns: With examples in Java", 2019, https://www.amazon.pl/dp/1617294543


### Saga Pattern

https://microservices.io/patterns/data/saga.html

> A saga is a sequence of local transactions. Each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga. If a local transaction fails because it violates a business rule then the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions.

There are two ways of coordination sagas:

- Choreography - each local transaction publishes domain events that trigger local transactions in other services
- Orchestration - an orchestrator (object) tells the participants what local transactions to execute


https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga

> The Saga design pattern is a way to manage data consistency across microservices in distributed transaction scenarios. A saga is a sequence of transactions that updates each service and publishes a message or event to trigger the next transaction step. If a step fails, the saga executes compensating transactions that counteract the preceding transactions.


In multiservices architectures:

- `Atomicity` is an indivisible and irreducible set of operations that must all occur or none occur.
- `Consistency` means the transaction brings the data only from one valid state to another valid state.
- `Isolation` guarantees that concurrent transactions produce the same data state that sequentially executed transactions would have produced.
- `Durability` ensures that committed transactions remain committed even in case of system failure or power outage.


## Local: run NodeJS servers

CLI/Terminal 1: `cd a_service && npm start` => http://localhost:3001/
CLI/Terminal 2: `cd b_service && npm start` => http://localhost:3002/
CLI/Terminal 3: `cd app_server && npm start` => http://localhost:3000/


## Local: how to trigger micro-services activities from CLI

- `curl -X POST -H "Content-Type: application/json" -d '{"service": "ServiceA", "message": "Hello from ServiceA"}' http://localhost:3001/data`
- `curl -X POST -H "Content-Type: application/json" -d '{"service": "ServiceB", "message": "Hello from ServiceB"}' http://localhost:3002/data`


## Docker: build images and run containers

In root folder: 

- `npm run up` or `docker-compose up -d`,
- when needed `npm run down` or `docker-compose down`

## Docker: Step by step

Build images:

- `docker build -t servicea:latest --file Dockerfile .`
- `docker build -t serviceb:latest --file Dockerfile .`
- `docker build -t serverapp:latest --file Dockerfile .`

Run containers :

**Without network, basic way, well enough**:

- `docker run --name=serviceA -p 3001:3001 -d servicea:latest`
- `docker run --name=serviceB -p 3002:3002 -d serviceb:latest`
- `docker run --name=serverApp -p 3000:3000 -d serverapp:latest`

Available URLs: http://localhost:3000/ which refers to API services: http://localhost:3001/getAData and http://localhost:3002/getBData

**If hostname IP-addresses needed (although doesn't work on MacOS)**:

- `docker network create my-microservices-network`
- `docker run --name=serviceA -p 3001:3001 --network=my-microservices-network -d servicea:latest`
- `docker run --name=serviceB -p 3002:3002 --network=my-microservices-network -d serviceb:latest`
- `docker run --name=serverApp -p 3000:3000 --network=my-microservices-network -d serverapp:latest`


## Docker: running via IP issue

To check list of networks: `docker network ls`

To inspect the IP addresses assigned to containers using the following command:

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' serviceA
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' serviceB
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' serverApp
```

In theory should be available URLs: http://172.17.0.8:3000/ which refers to API services: http://172.17.0.6:3001/ and http://172.17.0.7:3002/

But it's NOT possible to access via Browser on MacOS and it seems to be well known issue:

https://github.com/docker/for-mac/issues/2670#issuecomment-372365274

People suggest workaround related to some SOCKS settings, port 8888 and proxies.. I didn't try.


## Troubleshooting

A - Create Python server to test connectivity

- `docker exec -it serverApp python -m SimpleHTTPServer 3000`
- `curl http://172.17.0.4:3000`


B - Create Nginx server to test connectivity

- `docker run -d -p 8080:80 --name test-web-server nginx`
- `curl http://localhost:8080`
- `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-web-server`
- `curl http://172.17.0.2:8080` - ALSO IS NOT REACHABLE ON MacOS

- `docker exec -it serverApp ps aux | grep node`
> root         1  0.0  0.5 72x76 47x948 ?        Ssl  19:01   0:00 node server.js`

- `$ docker inspect serverApp | grep "NetworkMode"`
> "NetworkMode": "my-microservices-network",


## TODO later

- https://docs.docker.com/desktop/mac/permission-requirements/
- https://docs.docker.com/build/building/multi-stage/


## Redis - as EventBus aka Queue Management aka Messages Broker

ChatGPT:

- When ServerApp makes a request to ServiceA or ServiceB, include the necessary information in the request.
- Alternatively, you can directly communicate with the Redis container from ServerApp and let ServiceA and ServiceB consume the messages.
- Considerations:
  - This approach decouples ServiceA, ServiceB, and ServerApp, allowing them to communicate asynchronously.
  - If you want ServiceA and ServiceB to respond to requests from ServerApp, you might need a request-response pattern.
