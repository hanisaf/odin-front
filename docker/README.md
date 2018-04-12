# Host your application on a docker
An easy way to publish an instance of elasticsearch and nginx with minimal configuration, is using docker. The `docker-compose.yml` contains simple configrations to run nginx. It sets elasticsearch configuration from `elasticsearch.yml`, and nginx configuration from `default.conf`.

## Prerequisites 
- Increase the limitation of the directory that elasticsearch uses to store its indices by running this command
`sudo sysctl -w vm.max_map_count=262144`. [More information](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html)
- [Install docker](https://docs.docker.com/install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)
- Copy your elasticsearch data to the `esdata1` directory

## Setup
Run `docker-compose up` on the terminal. Wait about 15 seconds until elasticsearch runs completely. Then navigate to `http://localhost:8080/` on your web browser.

## Stop
Run `docker-compose down` on the terminal.
Data volumes will persist, so it’s possible to start the cluster again with the same data by running `docker-compose up`.

## Delete
To destroy the cluster and the data volume run `docker-compose down -v` on the terminal.
