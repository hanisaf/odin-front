#!/bin/bash

# this is a sample script that shows how to use the preprocessor and indexer Python scripts to load data from a CSV file into Elasticsearch/ODIN

# The sample data is 30 resilient city reports

python3 ../data-loader/preprocessor.py -i ./raw/resillient_cities.csv.gz -e yes -o RC_out.json

python3 ../data-loader/indexer.py -i RC_out.json -s http://localhost:9200 -w english -x resilient-cities

rm RC_out.json

