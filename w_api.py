#!/usr/bin/python

import json

class Api:
    def __init__(self, url='http://xml.weather.yahoo.com/forecastrss?p=%s'):
        self.url = url
    def get_weather_stats(self, zipcode):
        cli = self.connection
        try:
            stats = cli.stats(zipcode)
            return stats
        except Exception, error:
            return error

if __name__ == '__main__':
    main()
