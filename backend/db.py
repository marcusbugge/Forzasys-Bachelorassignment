from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/PostgreSQL_DB'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///SQLiteDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)
