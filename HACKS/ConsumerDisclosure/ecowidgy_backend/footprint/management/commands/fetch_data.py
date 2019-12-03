'''
Created on Nov 17, 2019

@author: Eleftherios Avramidis, Open Source Lab by DFKI
'''

import requests
import zipfile
import json
from time import sleep
from requests.exceptions import ConnectionError
from django.core.management.base import BaseCommand
import logging
from io import BytesIO
from footprint.models import Effect, EffectType, ProductType, Property

logger = logging.getLogger(__name__)

SLEEP = 1
PREPARE_PREFIX = "https://www.lcacommons.gov/lca-collaboration/ws/public/download/json/prepare/US_Environmental_Protection_Agency/USEEIO/PROCESS/"
JSON_PREFIX = "https://www.lcacommons.gov/lca-collaboration/ws/public/download/json/"

# These ids map our product categories to the processes of the database. 
# Here, the ids are retrieved manually as a proof of concept. Ideally the entire database should be downloaded and become searchable.  
# Alternatively, the full list could be crawled 
PRODUCT_PROCESS_UUIDS = {'soap': '22f8febd-bc20-31e4-9a6f-c5265e4cd6ce',
                            'telephone':'d46ba771-ea39-3aac-842b-56ab9edc9b98',
                            'milk': '96b4853a-8994-3b03-b0ac-313069b7d951',
    }

# This is not real data, it is by approximation. 
# @todo Official data need to be placed/fetched here!
PRODUCER_PRICE = {'soap': 0.1, #1$ per 100g
                    'telephone': 10.0,
                    'milk': 1.0, 
                    }

class Command(BaseCommand):
    help = 'Fetch indicative lifecycle assesment data from an official server and store them in the database'
    

    def handle(self, **kwargs):
        for product_type, uuid in PRODUCT_PROCESS_UUIDS.items():
            process_json = self._fetch_json(uuid)
            self._populate_database(process_json, product_type)
            # sleep one second to avoid overloading the server
            sleep(SLEEP)
    
    def _fetch_json(self, uuid):
        prepare_url = "".join([PREPARE_PREFIX, uuid])
            
        try:
            # ask server to prepare the json file
            prepare_response = requests.get(prepare_url)
            # get the id of the prepared file
            
        except ConnectionError as e:
            logger.warn("Could not request process description: {}".format(uuid))
            return None
        
        # the server has given a file id
        file_id = prepare_response.text
        # use the file id to request a json-ld zipfile
        file_url = "".join([JSON_PREFIX, file_id])
        zip_response = requests.get(file_url)
        
        # load the contents of the zipfile in the memory
        zipdata = BytesIO()
        zipdata.write(zip_response.content)
        jsonld_zipfile = zipfile.ZipFile(zipdata)
        
        # get the filename of the json file that describes the process
        jsonfilename = ([filename for filename in jsonld_zipfile.namelist() if filename.startswith("processes/") and filename.endswith(".json")])[0]
        
        # get the contents of that file and convert them to a json object
        jsonfile = jsonld_zipfile.open(jsonfilename) 
        process_json = json.loads(jsonfile.read())
        return process_json
    
    
    def _populate_database(self, process_json, product_type):
        product_type, _ = ProductType.objects.get_or_create(name=product_type,
                                                            price=PRODUCER_PRICE[product_type])
        for exchange in process_json['exchanges']:
            # get only the output for the moment
            print(exchange)
            if exchange['input'] is False:
                effect_type_name = exchange['flow']['name'] # Carbon dioxide

                # limit for the moment to CO2
                if effect_type_name != "Carbon dioxide":
                    continue
                                
                # get the value and the property 
                value = float(exchange['amount'])
                property_unit_name = exchange['unit']['name']
                property_name = exchange['flowProperty']['name']
                
                # lookup for the property only if an effect type is created
                def _property_get_or_create():
                    effect_property, _ = Property.objects.get_or_create(name=property_name, 
                                                   defaults={'unit':property_unit_name})
                    return effect_property
                
                # get the effect type to be referenced
                effect_type, _ = EffectType.objects.get_or_create(name=effect_type_name,
                                                               defaults={'property': _property_get_or_create()})
                
                # create the effect
                effect = Effect(product_type=product_type,
                                effect_type=effect_type,
                                value=value)
                effect.save()
        print(len(Effect.objects.all()))