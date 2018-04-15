#!/bin/bash

# this is a sample script that shows how to use the preprocessor and indexer Python scripts to load data from a CSV file into Elasticsearch/ODIN

# The sample data is 2000 Earning Calls in raw/EC2000.csv.gz

python3 ../data-loader/preprocessor.py -i ./raw/EC2000.csv.gz -e yes -o EC_out.json

python3 ../data-loader/indexer.py -i EC_out.json -s http://localhost:9200 -x earning-calls

rm EC_out.json

