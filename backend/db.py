from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask import Flask

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/database'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///buggeDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)