from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/auth')
def auth():
    # if 'name' in request.args:
    #     return 'Hello ' + request.args['name']
    # else:
    #     return 'Hello John Doe'
    print(request.args)
    
    response = app.response_class(
        response={"a":"b"},
        status=200,
        mimetype='application/json'
    )
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)