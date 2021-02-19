#!/bin/python3
import requests
import json
import os

fileName = 'streamFlowStations.json'

if os.path.exists(fileName):
    os.remove(fileName)

states = 'AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY'.split(
    ',')

arr = []

for state in states:

    url = '&'.join(['https://waterservices.usgs.gov/nwis/iv/?format=json',
                    'stateCd=' + state, 'siteType=ST', 'siteStatus=active'])

    r = requests.get(url)

    if r.status_code == 200:

        data = r.json()

        for item in data['value']['timeSeries']:
            info = item['sourceInfo']
            obj = {}
            # obj['name'] = info['siteName']
            obj['lat'] = round(info['geoLocation']
                               ['geogLocation']['latitude'] * 10000) / 10000.0
            obj['lng'] = round(info['geoLocation']
                               ['geogLocation']['longitude'] * 10000) / 10000.0
            obj['uid'] = info['siteCode'][0]['agencyCode'] + \
                ':' + info['siteCode'][0]['value']
            arr.append(obj)

        print(state)
    else:
        print('retrieval for state code ' + state + ' failed')


with open(fileName, 'w') as f:
    json.dump(arr, f)
