from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load workouts data
with open('data/workouts.json', 'r') as f:
    data = json.load(f)

@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    return jsonify(workouts=data['workouts'])

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(userHistory=data['userHistory'])

if __name__ == '__main__':
    app.run(debug=True)

