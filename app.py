from flask import Flask, request, jsonify
import joblib
import os
import pandas as pd

app = Flask(__name__)

# Učitaj model (pretpostavljam da je pkl u istom direktoriju)
model = joblib.load('mushroom_model_Gradient Boosting.pkl')

@app.route('/')
def home():
    return "API radi. Pošalji POST na /predict."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Dobivanje JSON podataka iz POST zahtjeva
        data = request.get_json()

        # Pretpostavljam da ti dolaze podaci u obliku dict koji možeš pretvoriti u DataFrame
        input_df = pd.DataFrame([data])

        # Predikcija (ako trebaš transformacije podataka, ubaci ih ovdje)
        prediction = model.predict(input_df)[0]
        prediction_proba = model.predict_proba(input_df)[0][1]

        # Vraćamo predikciju i vjerojatnost kao JSON
        return jsonify({
            'prediction': int(prediction),
            'probability': float(prediction_proba)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
