from importlib.resources import Resource
from flask import Flask
from flask_restful import Api, Resource

"""
https://www.youtube.com/watch?v=GMppyAPbLYk&ab_channel=TechWithTim
"""

app = Flask(__name__)
api = Api(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == "__main__":
    app.run(debug=True)
