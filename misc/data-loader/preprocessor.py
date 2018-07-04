
# coding: utf-8

# In[ ]:


#!/usr/bin/env python3


# In[4]:


import os
import logging
import optparse
from dateutil import parser
import requests


# In[5]:


from datetime import datetime
from collections import defaultdict


# In[16]:


import sqlite3 as lite
import time
import pandas as pd
from itertools import groupby
from functools import reduce


# In[7]:


import nltk
from nltk.tag.stanford import StanfordNERTagger


# In[8]:


logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')


# In[9]:


def stanford_ne(text):
    d = defaultdict(set)
    netagged_words = st.tag(nltk.word_tokenize(text))
    for tag, chunk in groupby(netagged_words, lambda x:x[1]):
        if tag != "O":
            chk =  " ".join(w for w, t in chunk)
            d[tag].add(chk)
    return d


# In[10]:


def jsonify_entities(entities):
    try:
        all_e = reduce(lambda x, y: x.union(y), entities.values())
    except TypeError:
        all_e = []
    entities['ALL'] = all_e
    return {k:list(v) for k, v in entities.items()}


# In[11]:


def test_for_resources(filename, directory):
    msg = 'cannot find resource file ' + filename
    if not os.path.exists(filename):
        filename = os.path.expanduser(directory + filename)
        if not os.path.exists(filename):
            logging.error(msg)
            logging.info('You need Stanford NER for entity extraction')
            logging.info('Download from http://nlp.stanford.edu/software/CRF-NER.shtml')
            logging.info('and extract in your home directory/stanford-ner')
            exit(-1)
    return filename


# In[12]:


def generate_entities(df):
    global st
    engine = test_for_resources('stanford-ner.jar', '~/stanford-ner/')
    classifier = test_for_resources('english.muc.7class.distsim.crf.ser.gz', '~/stanford-ner/classifiers/')
    st = StanfordNERTagger(classifier, engine)
    nes = []
    i = 0
    for t in df.text:
        ne = stanford_ne(t)
        ne2= jsonify_entities(ne)
        nes.append(ne2)
        i=i+1
        if i % 10 == 0:
            logging.log
            logging.info("%d documents processed" % i) 
    df['ENTITIES'] = nes    
    return df


# In[13]:


def readfile(options):
    df = None
    filename=options.input
    if '.csv' in filename:
        df=pd.read_csv(filename, encoding = "utf-8")
    elif ext in filename:
        df=pd.read_json(filename)
    elif ext in filename:
        df=pd.read_sql(options.query, lite.connect(filename))
    else:
        logging.error('Unknown file type')
        exit(-1)
    if not 'text' in df.columns and options.entities=='yes':
        logging.error('Text column is required when entities are selected')
        exit(-1)
    try:
        if 'timestamp' in df.columns:
            ts = df.timestamp.map(parser.parse)
    except:
        logging.warning("WARNING : cannot parse timestamp, time-date filter may not work")
    return df
    #return df.head()


# In[14]:


def trim(tags):
    tags = tags.split(',')
    ntags = map(lambda x: x.strip(), tags)
    if ntags == [""]:
        ntags=[]
    return ntags


# In[ ]:


def process(options):
    print("Reading input file ... ")
    df = readfile(options)
    #df = df.head()
    logging.info("Preprocessing ...") 
    #df = df.fillna("")
    df.columns = map(lambda x: x.replace('.', '__'), df.columns)
    #del df['index']
    cols = set(df.columns) - set(['text', 'timestamp'])
    for col in cols:
        if col[-1] == 's': #a  text tag column
            if type(df[col].ix[0])==type(df['text'].ix[0]):
                df[col] = df[col].map(lambda x: trim(x))
                
    if options.entities=='yes':
        logging.info("Extracting name entities (slowww) ...")
        df=generate_entities(df)
        
    logging.info("Writing output file ... ")    
    if 'id' in df.columns:
        df.index = df['id']
        
    df.to_json(options.output, orient="records")
    logging.info("Done!")


# In[ ]:


def main():
    usage = "usage: %prog [options]"
    parser = optparse.OptionParser(usage)
    parser.add_option("-i", "--input",  dest="input",
                    action="store", type="string",
                    help="""input file name. 
                    The program takes .csv, .json & .db sqlite files.
                    If .db file is used, you need to pass a query
                    The program assumes unicode encoding in text files
                    
                    Column names:
                    text: main text to be processed (required when entities are selected)
                    
                    timestamp (optional): will be used for time-date filter
                    
                    type (optional): will be used for type selection
                    
                    id (optional): will be used as document id, must be unique
                    
                    Singular noun named columns are field columns
                    plural named columns (ending with s) are tag columns 
                     tags will be generated by tokenizing on comma
                    """)

    parser.add_option("-o", "--output", dest="output",
                     action="store", type="string", default="out.json",
                     help="output file name default is out.json")
    
    parser.add_option("-e", "--generate-entities", dest="entities",
                    action="store", type="string", default="no",
                    help="""Generate name entities from text yes/no?
                      Default is no""")
  
    parser.add_option("-q", "--query", dest="query",
                    action="store", type="string", default="select * from documents",
                    help="""query to be used for sqlite file, default is
                    "select * from documents" Do not forget to quote the query""")    
    
    options, args = parser.parse_args()

    if not options.input:
        logging.info(parser.format_help())
        return
    
    if os.path.exists(options.output):
        logging.error("output file already exist")
        return
    
    process(options)
    


# In[ ]:


if __name__ == "__main__":
    main()  
    exit()


# In[24]:


get_ipython().system('jupyter nbconvert --to script preprocessor.ipynb')


# In[20]:


get_ipython().magic('pinfo pd.DataFrame.to_json')

