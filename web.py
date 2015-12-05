#!/usr/bin/python

import json
import sys
import urllib
from argparse import ArgumentParser
from xml.dom.minidom import parse
import os
import argparse

from flask import Flask, jsonify

from weather import get_weather

from weather import create_cli_parser
from weather import create_report
DAYS_LIMIT = 2
WEATHER_URL = 'http://xml.weather.yahoo.com/forecastrss?p=%s'
METRIC_PARAMETER = '&u=c'
WEATHER_NS = 'http://xml.weather.yahoo.com/ns/rss/1.0'


# Create API connection
#weather_api = Api()

# Create Flask app
app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/<location_code>')
def weather(location_code):
    # Create the command line parser.
    cli_parser = create_cli_parser()

    # Get the options and arguments.
    args = cli_parser.parse_args([location_code])

    weather_stats = get_weather(location_code,args)

    return jsonify({"data": weather_stats})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10001, debug=True)
