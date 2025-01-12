from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import json
from PIL import Image
from flask_cors import CORS  # CORS 임포트

# Flask 앱 초기화
app = Flask(__name__)

# CORS 설정
CORS(app)

# TensorFlow 모델 로드
model = tf.keras.models.load_model('C:/Users/SonSeongHan/Desktop/gamestore/gamestore_front/finetuned_model2.h5')

# 레이블 매핑 로드
with open('C:/Users/SonSeongHan/Desktop/gamestore/gamestore_front/label_mapping2.json', 'r', encoding='utf-8') as f:
    label_mapping = json.load(f)

# 레이블 매핑: 인덱스 -> 이름
reverse_mapping = {v: k for k, v in label_mapping.items()}

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'GET':
        return jsonify({'message': 'Flask 서버가 실행 중입니다.'}), 200

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # 이미지 처리
        image = Image.open(file).convert('RGB')
        image = image.resize((224, 224))  # 모델 입력 크기로 조정
        image_array = np.array(image, dtype=np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가

        # 모델 예측
        predictions = model.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1)[0]

        # 예측 결과 매핑
        label = reverse_mapping[predicted_class]

        return jsonify({
            'class': label,
            'probabilities': predictions.tolist(),
        })

    except Exception as e:
        print(f"Flask Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
 