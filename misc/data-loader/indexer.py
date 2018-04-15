
# coding: utf-8

# In[6]:


#!/usr/bin/env python3
import os
import logging
import optparse
from datetime import datetime
import requests
import json


# In[5]:


q=  {
        "mappings": {
            "_doc": {
                "dynamic_templates": [
                    {
                        "objects": {
                            "match": "*",
                            "match_mapping_type" : "object",
                            "mapping": {
                                "type": "nested",
                                "include_in_parent": True
                            }

                        }
                    }, 
                    {
                        "strings_as_keywords": {
                            "match_mapping_type": "*",
                            "mapping": {
                                "type": "keyword"
                            }
                        }
                    }

                ],
                "properties": {
                    "id": { "type": "keyword" },
                    "type": { "type": "keyword" },
                    "timestamp": {"type": "date"},
                    "text": { "type": "text", "analyzer": "stop_analyzer" }
                }
            }
        },
        "settings": {
            "analysis": {
                "analyzer": {
                    "stop_analyzer": {
                        "type": "stop",
                        "stopwords": "_none_",
                        "ignore_case": True
                    }
                }
            }
        }
    }


# In[2]:


logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')


# In[ ]:


def process(options):

    logging.info("Testing ES ... ")
    url = options.server + "/" + options.index
    print(url)
    headers = {'content-type': 'application/json'}
    res=requests.get(url)
    logging.info("Reading input file ... ")    
    data = json.load(open(options.input, "r"))
    assert len(data) > 0
    logging.info("Creating index ... ")
#     # first if type is available, we need to map it to a keyword
#     row = data[0]
#     if 'type' in row.keys() and options.mapping != "yes":
#         create_index = """
#             {
#                 "mappings": {
#                     "_doc": {
#                     "properties": {
#                       "type": { "type": "keyword" }
#                     }
#                     }
#                 }
#             }
#             """
#         res = requests.put(url, create_index, headers=headers).text
#         logging.info(res)
#     elif options.mapping == "yes":
#         create_index = """
#             {
#                 "mappings": {
#                     "_doc": {
#                     "dynamic_templates": [
#                             {
#                                 "strings_as_keywords": {
#                                   "match_mapping_type": "string",
#                                   "mapping": {
#                                    "type": "keyword"
#                                   }
#                             }
#                           }

#                         ],                    
#                     "properties": {
#                        "type": { "type": "keyword" },
#                        "text": { "type": "text" }
#                     }
#                     }
#                 }
#             }
#             """
#         res = requests.put(url, create_index, headers=headers).text
#         logging.info(res)
    if options.stop != "none":
        language = "_" + options.stop + "_"
        q["settings"]["analysis"]["analyzer"]["stop_analyzer"]["stopwords"] = language
    builtin = ["type", "text", "timestamp", "id"]
    row = data[0]
    for b in builtin:
        if b not in row.keys():
            del q["mappings"]["_doc"]["properties"][b]
    res = requests.put(url, json.dumps(q), headers=headers).text
    logging.info(res)
    logging.info("Loading data ... ")
    errors = 0
    for i in range(len(data)):
        doc = data[i]
        idx = str(i)
        if 'id' in doc.keys():
            idx = str(doc['id'])
        try:
            res = requests.post(url=url+"/_doc/"+idx,json=doc)
            if res.status_code < 200 or res.status_code > 299:
                logging.error(res.text)
        except Exception as inst:
            errors=errors+1
            logging.error("Cannot process document %d" %i)
            logging.error(type(inst))
            logging.error(inst)
            logging.error(d)
        if i % 1000 == 0:
            logging.info("%d documents processed" % i)   
    logging.info("%d documents processed" % i)
    logging.info("Done!")
    if errors > 0:
        logging.error("%d errors were encountered"%errors)


# In[3]:


def main():
    usage = "usage: %prog [options]"
    parser = optparse.OptionParser(usage)
    parser.add_option("-i", "--input",  dest="input",
                    action="store", type="string", default="out.json",
                    help="""input file name, .json file generated by preprocessor
                            default is out.json""")

#     parser.add_option("-m", "--mapping", dest="mapping",
#                      action="store", type="string", default="yes",
#                      help="create index with default mappings, default is yes")

    parser.add_option("-s", "--server", dest="server",
                     action="store", type="string", default="http://localhost:9200",
                     help="elasticsearch url, default is http://localhost:9200")
    
    parser.add_option("-x", "--index", dest="index",
                     action="store", type="string", default="documents",
                     help="elasticsearch index name, default is documents")
     
    parser.add_option("-w", "--stop-words", dest="stop",
                     action="store", type="string", default="none",
                     help="filter stop words, indicate the language or none: arabic, armenian, basque, bengali, brazilian, bulgarian, catalan, czech, danish, dutch, english, finnish, french, galician, german, greek, hindi, hungarian, indonesian, irish, italian, latvian, norwegian, persian, portuguese, romanian, russian, sorani, spanish, swedish, thai, turkish")
            
    options, args = parser.parse_args()
    
    process(options)


# In[ ]:


if __name__ == "__main__":
    main()  
    exit()


# In[12]:


get_ipython().system('jupyter nbconvert --to script indexer.ipynb')

