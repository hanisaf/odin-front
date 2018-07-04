from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os.path
import pathlib
import re
import datetime
import subprocess
from subprocess import call

UPLOAD_FOLDER = '/home/saber/workspace/angular-python-sandbox/backend/temp'
ALLOWED_EXTENSIONS = set(['csv', 'gz', 'csv.gz', 'zip'])
PREPROCESSOR_PATH = '/home/saber/workspace/odin-front/misc/data-loader/preprocessor.py'
INDEXER_PATH = '/home/saber/workspace/odin-front/misc/data-loader/indexer.py'

app = Flask(__name__)
app.debug = True
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cors = CORS(app) #, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/jsontest')
def get_test():
    return jsonify("{text:'test ok2!'}")

@app.route('/upload')
def show_upload_form():
    return render_template('upload.html')

@app.route('/uploader', methods = ['GET', 'POST'])
def upload():
    msgSaveFile = "OK!"
    msgPreprocess = ""
    msgIndexer = ""
    if request.method == 'POST':
        password= request.form.get('password')
        if (password != "1"):
            msgSaveFile = 'Invalid password'
        else:
            file = request.files['file']
            entitiesYesNo = request.form.get('entities')
            indexName = request.form.get('indexname')
            serverAddress= request.form.get('serveraddress')
            if file and allowed_file(file.filename):
                filename = saveFile(file)
                outputFileName, msgPreprocess = preprocess(filename,entitiesYesNo,serverAddress,indexName)
                msgIndexer = indexer(outputFileName, serverAddress, indexName)
            else:
                msgSaveFile = 'Error in uploading the file'

    return render_template('uploaded.html', msgSaveFile=msgSaveFile, msgPreprocess=msgPreprocess,msgIndexer=msgIndexer)

def saveFile(file):
    #parentPath = os.path.dirname(os.path.realpath(__file__))
    #path = os.path.abspath(os.path.join(parentPath, os.pardir)) 
    #filename = secure_filename(file.filename)
    extension = "".join(pathlib.Path(secure_filename(file.filename)).suffixes)
    filename = secure_filename(file.filename.replace(extension,"")) + '-' + str(datetime.datetime.now().time()).replace(':', '_').replace('.','_') +  extension
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return filename

def preprocess(filename,entitiesYesNo, serverAddress, indexName):
    output = None
    msg = ""
    try:
        extension = "".join(pathlib.Path(filename).suffixes)
        outputFileName = filename.replace(extension, ".out.json")
        #python3 ../data-loader/preprocessor.py -i ./raw/EC2000.csv.gz -e yes -o EC_out.json
        output = subprocess.run(['python3',PREPROCESSOR_PATH,'-i',os.path.join(app.config['UPLOAD_FOLDER'], filename),'-e',entitiesYesNo,'-o',os.path.join(app.config['UPLOAD_FOLDER'], outputFileName)], stdout=subprocess.PIPE)
        msg += "Created: " + outputFileName + "<br />"
        msg += str(output.stdout).replace('\n', '<br>')
        return outputFileName, msg

    except subprocess.CalledProcessError as e:
        msg = "ERROR:" + str(e.output)

def indexer(filename, serverAddress, indexName):
    output = subprocess.run(['python3',INDEXER_PATH,'-i',os.path.join(app.config['UPLOAD_FOLDER'], filename),'-s',serverAddress,'-x',indexName], stdout=subprocess.PIPE)
    msg = "<hr />"
    msg += "Imported Successfuly! " + indexName + " index is ready on " + serverAddress + "\n"
    msg += str(output.stdout).replace('\n', '<br>')
    # except Exception as inst:
    #     msg += "Exception Type= " + str(type(inst))   # the exception instance
    #     msg += "Exception Arguments= " + str(inst.args)    # arguments stored in .args
    #     msg += "Exception Details= " + str(inst)          # __str__ allows args to be printed directly,
    return msg

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# if __name__ == '__main__':
#    app.run(debug = True)
