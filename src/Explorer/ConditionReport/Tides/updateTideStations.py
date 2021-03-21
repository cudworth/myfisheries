#!/bin/python3
import requests
import json
import os

fileName = 'tideStations.json'

if os.path.exists(fileName):
    os.remove(fileName)

url = '&'.join(
    ['https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?', 'type=tidepredictions'])

arr = []

r = requests.get(url)

if r.status_code == 200:

    data = r.json()

    for station in data['stations']:
        obj = {}
        obj['i'] = station['id']
        obj['t'] = round(station['lat'] * 1000) / 1000.0
        obj['n'] = round(station['lng'] * 1000) / 1000.0
        arr.append(obj)

    with open(fileName, 'w') as f:
        json.dump(arr, f)


else:
    print('request failed')
