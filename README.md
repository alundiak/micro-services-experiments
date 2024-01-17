MicroServices Experiments
===

Intention of this repo is purely educational. I do experiment with different micro-services setup. And I plan at least to use GitHub Actions for deployment.

This code extracted from another repo [showcases](https://github.com/alundiak/showcases/tree/main/SOA) where I initially planned to extend a "SOA" information. But MicroServices as a topic became wider, and it caused a dedicated repo.

## SOA => Microservices

More info => [SOA and MicrosServices info](./README_INFO.md)

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

- `docker build -t service-a-img:latest --file Dockerfile .`
- `docker build -t service-b-img:latest --file Dockerfile .`
- `docker build -t server-app-img:latest --file Dockerfile .`

Run containers :

**Without network, basic way, well enough**:

- `docker run --name=ServiceAContainer -p 3001:3001 -d service-a-img:latest`
- `docker run --name=ServiceBContainer -p 3002:3002 -d service-b-img:latest`
- `docker run --name=ServerAppContainer -p 3000:3000 -d server-app-img:latest`

Available URLs: http://localhost:3000/ which refers to API services: http://localhost:3001/getAData and http://localhost:3002/getBData

**If hostname IP-addresses needed (although doesn't work on MacOS)**:

- `docker network create my-microservices-network`

- `docker run --name=ServiceAContainer -p 3001:3001 --network=my-microservices-network -d service-a-img:latest`
- `docker run --name=ServiceBContainer -p 3002:3002 --network=my-microservices-network -d service-b-img:latest`
- `docker run --name=ServerAppContainer -p 3000:3000 --network=my-microservices-network -d server-app-img:latest`

## Docker: running via IP issue

To check list of networks: `docker network ls`

To inspect the IP addresses assigned to containers using the following command:

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ServiceAContainer
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ServiceBContainer
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ServerAppContainer
```

In theory should be available URLs: http://172.17.0.8:3000/ which refers to API services: http://172.17.0.6:3001/ and http://172.17.0.7:3002/

But it's NOT possible to access via Browser on MacOS and it seems to be well known issue:

https://github.com/docker/for-mac/issues/2670#issuecomment-372365274

People suggest workaround related to some SOCKS settings, port 8888 and proxies.. I didn't try.


## Docker: running by hostname aka service name

Depends on what value is in `docker-compose.yml` file under `services` section then Services can be reached INSIDE OF DOCKER CONTAINER !!! using host names aka aliases of Docker services.

- http://service-a:3001/
- http://service-b:3002/
- http://server-app:3000/

It works either for inside app `axios` calls or `curl` (if exists) or `wget` requests.

From main host environment (like I have MacOS) those host names ARE NOT REACHABLE!


## Troubleshooting

A - Create Python server to test connectivity

- `docker exec -it ServerAppContainer python -m SimpleHTTPServer 3000`
- `curl http://172.17.0.4:3000`

TBD. NodeJS image => container doesn't have `python` or `python2` or `python3`.

B - Create Nginx server to test connectivity

- `docker run -d -p 8080:80 --name test-web-server nginx`
- `curl http://localhost:8080`
- `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-web-server`
- `curl http://172.17.0.2:8080` - ALSO IS NOT REACHABLE ON MacOS

- `docker exec -it ServerAppContainer ps aux | grep node`
> root         1  0.0  0.5 72x76 47x948 ?        Ssl  19:01   0:00 node server.js`

- `docker inspect ServerAppContainer | grep "NetworkMode"`
> "NetworkMode": "my-microservices-network",

- `docker image prune` purges dangling images, and looks like helps to avoid it in future. USe `--force` to avoid confirmation. `-y` doesn't work.

To investigate further, you can use the docker container stop command with the `--time` option to specify a timeout. 

- `docker container stop --time=5 <container_name_or_id>`

```
docker container logs <container_name_or_id>
docker events
```


## TODO later

- https://docs.docker.com/desktop/mac/permission-requirements/
- https://docs.docker.com/build/building/multi-stage/
