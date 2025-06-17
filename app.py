# app.py
from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Učitaj trenirani Gradient Boosting model pri pokretanju aplikacije
with open("mushroom_model_Gradient Boosting.pkl", "rb") as f:
    model = pickle.load(f)


@app.route('/predict', methods=['POST'])

def predict():
    # Očekuje se da dobiješ podatke u formi:
    # {"features": [vrijednosti_features]}
    data = request.json
    
    preds = model.predict([data['features']])
    return jsonify({'prediction': int(preds[0])})


if __name__ == '__main__':
    app.run(debug=False)
