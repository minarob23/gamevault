from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder

app = Flask('app')
CORS(app)

model = None
encoders = {
    "Platform": LabelEncoder(),
    "Genre": LabelEncoder(),
    "Publisher": LabelEncoder()
}

# Load and fit encoders with training data
try:
    df = pd.read_csv('attached_assets/vgsales.csv')
    for col, encoder in encoders.items():
        encoders[col].fit(df[col].astype(str))
except Exception as e:
    print(f"Error loading training data: {e}")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

try:
    model = joblib.load('attached_assets/full_linear_regression_model.pkl')
    if not hasattr(model, 'predict'):
        raise AttributeError("Model does not have predict method")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def home():
    return jsonify({
        'status': 'API is running',
        'endpoints': {
            '/predict': 'POST - Make video game sales predictions'
        }
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided',
                'status': 'error',
                'message': 'Please provide valid game data'
            }), 400

        required_fields = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Year', 'Rank', 'Platform', 'Genre', 'Publisher']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({
                'error': 'Missing fields',
                'status': 'error',
                'message': f'The following fields are required: {", ".join(missing_fields)}'
            }), 400

        # Prepare input data
        # Encode categorical variables
        try:
            input_data = pd.DataFrame([{
                'NA_Sales': float(data['NA_Sales']),
                'EU_Sales': float(data['EU_Sales']),
                'JP_Sales': float(data['JP_Sales']), 
                'Other_Sales': float(data['Other_Sales']),
                'Year': int(data['Year']),
                'Rank': int(data['Rank']),
                'Platform': data['Platform'],
                'Genre': data['Genre'],
                'Publisher': data['Publisher']
            }])

            # Handle categorical variables by using the most common category for unknown values
            try:
                df = pd.read_csv('attached_assets/vgsales.csv')
                for col in ['Platform', 'Genre', 'Publisher']:
                    input_data[col] = input_data[col].astype(str)
                    if not set(input_data[col]).issubset(set(encoders[col].classes_)):
                        # Replace unknown values with most common value from training data
                        most_common = df[col].mode()[0]
                        input_data[col] = most_common
                    input_data[col] = encoders[col].transform(input_data[col])
            except Exception as e:
                return jsonify({
                    'error': str(e),
                    'status': 'error',
                    'message': f'Error processing categorical data. Please use valid values from training data.'
                }), 400

        except Exception as e:
            return jsonify({
                'error': str(e),
                'status': 'error',
                'message': 'Error processing input data'
            }), 400

        # Apply square root transformation to sales columns
        sales_columns = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales']
        input_data[sales_columns] = np.sqrt(input_data[sales_columns])

        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'status': 'error',
                'message': 'The prediction model is not available'
            }), 500

        # Make prediction
        try:
            prediction = model.predict(input_data)[0]
            # Square the prediction to reverse the transformation
            final_prediction = prediction ** 2
        except Exception as e:
            return jsonify({
                'error': str(e),
                'status': 'error',
                'message': 'Failed to make prediction'
            }), 500

        return jsonify({
            'prediction': float(final_prediction),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
