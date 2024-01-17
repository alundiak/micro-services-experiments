MicroServices Experiments
===

Intention of this repo is purely educational. I do experiment with different micro-services setup. And I plan at least to use GitHub Actions for deployment.

This code extracted from another repo [showcases](https://github.com/alundiak/showcases/tree/main/SOA) where I initially planned to extend a "SOA" information. But MicroServices as a topic becomes wider, and so caused a dedicated repo.

## SOA => Microservices

[SOA and MicrosServices info](./README_INFO.md)

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
