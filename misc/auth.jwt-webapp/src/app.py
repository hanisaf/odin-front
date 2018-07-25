#README:
# 1- to get the access token, curl -H "Content-Type: application/json" -X POST -d '{"username":"demo","password":"pass"}' http://localhost:5000/auth
# 2- you well get a tokenvalue, replace it in the command below
# 3- to use the token to call elasticsearch: curl -X GET https://elasticsearch.sabersol.com/test-index -H "Authorization: JWT tokenvalue"

#more info: to test this app, instead of the url of step 3, use this url: curl -X GET http://localhost:5000/api/v1/private -H "Authorization: JWT tokenvalue"
from flask import Flask
from flask_restful import Resource, Api
from flask_jwt import JWT, jwt_required

app = Flask(__name__)
#list of app configurations: http://flask-jwt-extended.readthedocs.io/en/latest/options.html
app.config['SECRET_KEY'] = 'zxSn&DdN^g@8DF7!4gn'
app.config['JWT_ALGORITHM'] = 'RS256'

api = Api(app, prefix="/api/v1")

USER_DATA = {
    "user_id": "saber"
}


class User(object):
    def __init__(self, id):
        self.id = id

    def __str__(self):
        return "User(id='%s')" % self.id


def verify(username, password):
    return User(id="saber")
    # if not (username and password):
    #     return False
    # if USER_DATA.get(username) == password:
    #     return User(id=123)


def identity(payload):
    #user_id = payload['identity']
    return {"user_id": "saber"}


jwt = JWT(app, verify, identity)
#jwt.encode({'user_id': 'saber'}, 'zxSn&DdN^g@8DF7!4gn', algorithm='ES256')


class PrivateResource(Resource):
    @jwt_required()
    def get(self):
        return {"message": "access granted!"}

api.add_resource(PrivateResource, '/private')

if __name__ == '__main__':
    app.run(debug=True)