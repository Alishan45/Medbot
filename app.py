#app.py
import os
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
from database import initialize_db, add_user, authenticate_user, update_password
from flask_cors import CORS

# Set up the environment variable for the Gemini API key
os.environ["GEMINI_API_KEY"] = "AIzaSyCjyoRuE7Bf61arD5aMYbo8QmRbqeU4gzA"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create Flask app
app = Flask(__name__)
CORS(app)
# Initialize the database
initialize_db()
@app.route('/signup', methods=['POST'])
def signup():
    print(request.json) 
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required.'}), 400

    if add_user(name, email, password):
        return jsonify({'message': 'User registered successfully.'}), 201
    else:
        return jsonify({'error': 'Email already exists.'}), 400

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    print(request.json) 
    # Parse JSON request
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Authenticate user
    if authenticate_user(email, password):
        return jsonify({'redirect_url': 'http://127.0.0.1:5000'}), 200
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401

# Forgot Password Endpoint
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    # Parse JSON request
    print(request.json) 
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    # Update the user's password
    if update_password(email, new_password):
        return jsonify({'message': 'Password updated successfully.'}), 200
    else:
        return jsonify({'error': 'Email not found.'}), 404


# Configure generation settings
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 50,
    "max_output_tokens": 300,
}

# Initialize the model
model = genai.GenerativeModel(
    model_name="gemini-exp-1206",
    generation_config=generation_config,
)

# Start a new chat session
chat_session = model.start_chat(history=[])

@app.route('/')
def serve_ui():
    # Serve the Medbot Chat UI HTML file
    return send_from_directory(os.getcwd(), 'demo.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        user_message = request.json.get('message', '')
        if not user_message.strip():
            return jsonify({"response": "Please enter a valid message."}), 400

        # Prepend the medical expert prompt to the user's message
        prompt_message = f"As a medical Expert, you are required to answer: {user_message}"

        # Generate a response from Gemini API
        response = chat_session.send_message(prompt_message)

        # Return the generated response
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
