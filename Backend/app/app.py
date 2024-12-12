from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

port = int(os.getenv("PORT", 3000))  # Default to 3000 if not set
host = os.getenv("HOST", "0.0.0.0")  # Default to 0.0.0.0

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hello from the backend!",
        "data": [1, 2, 3, 4, 5]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host=host, port= port)

