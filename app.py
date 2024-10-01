from flask import Flask

app = Flask("Route")

@app.route('/')
def index():
    return '''<h1>Hello world</h1>'''