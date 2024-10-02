from flask import Blueprint, jsonify
import json

# Blueprint for the API
api = Blueprint('api', __name__)

# Function to load JSON data
def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None

@api.route('/route1', methods=['GET'], strict_slashes=False)
def get_route1_data():
    data = load_json_data('data/soha_final.json')
    if data :
        return jsonify(data), 200
    else:
        jsonify({"error": "Data not found"}), 404

@api.route('/route2', methods=['GET'])
def get_route2_data():
    data = load_json_data('data/civil_final.json')
    if data :
        return jsonify(data), 200
    else:
        jsonify({"error": "Data not found"}), 404

@api.route('/route3', methods=['GET'])
def get_route3_data():
    data = load_json_data('data/hard_final.json')
    if data :
        return jsonify(data), 200
    else:
        jsonify({"error": "Data not found"}), 404
