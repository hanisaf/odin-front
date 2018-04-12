#Taken from https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html
sudo sysctl -w vm.max_map_count=262144

#Taken from: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

To pull on a persisted drive:
	docker-compose up

To stop the cluster: 
	docker-compose down

Data volumes will persist, so it’s possible to start the cluster again with the same data using docker-compose up`. 

To destroy the cluster and the data volume:
	docker-compose down -:v.
