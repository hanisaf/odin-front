#!/bin/bash
export FLASK_APP=./src/app.py
export FLASK_ENV=development flask run
#source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0
