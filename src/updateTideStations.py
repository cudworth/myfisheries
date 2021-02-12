#!/bin/python3
import requests, json

url = '&'.join(['https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?','type=tidepredictions'])
r = requests.get(url)
if r.status_code == 200:
  with open('tideStations.json','w') as f:
      json.dump(r.json(),f)
else:
  print('request failed')