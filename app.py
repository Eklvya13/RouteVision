from flask import Flask
from api import api

app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def index():
    return '''<h1>Hello world</h1>'''