# Host your application on a docker

An easy way to publish an instance of elasticsearch and nginx with minimal configuration, is using docker. 

## Prerequisites 
- On linux, increase the limitation of the directory that elasticsearch uses to store its indices by running this command
`sudo sysctl -w vm.max_map_count=262144`. [More information](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html)
- [Install docker](https://docs.docker.com/install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)

## Run demo
Shell script:
Run `./setup.sh` from terminal.
Wait about 15 seconds until elasticsearch runs completely. Then navigate to `http://localhost:8080/` on your web browser.

## Details
The `docker-compose.yml` contains simple configrations to run nginx. It sets elasticsearch configuration from `elasticsearch.yml`, and nginx configuration from `default.conf`. Sample data will be loaded from `misc/sampledata`.

### Setup
Follow the instructions on the "Run demo" section. Or, unzip `dist.zip` from the root to `misc/data`. Then go to `misc/docker` directory and run `docker-compose up` on the terminal. 

### Stop
Run `docker-compose down` on the terminal.
Data volumes will persist, so it’s possible to start the cluster again with the same data by running `docker-compose up`.

### Delete
To destroy the cluster and the data volume run `docker-compose down -v` on the terminal.
