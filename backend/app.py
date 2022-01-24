from importlib.resources import Resource
from flask import Flask
from flask_restful import Api, Resource

"""
https://www.youtube.com/watch?v=GMppyAPbLYk&ab_channel=TechWithTim
"""

app = Flask(__name__)
api = Api(app)

class KYS(Resource):
    def get(self):
        print("KYS ALLE SAMMEN")

api.add_resource(KYS, "/KYS")

if __name__ == "__main__":
    app.run(debug=True)
