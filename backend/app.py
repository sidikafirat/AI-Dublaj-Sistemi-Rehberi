from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Çevre değişkenlerinden API bilgilerini al
DEEPL_API_KEY = os.getenv('DEEPL_API_KEY')
DEEPL_API_URL = os.getenv('DEEPL_API_URL', 'https://api-free.deepl.com/v2/translate')

# API anahtarı kontrolü
if not DEEPL_API_KEY:
    print("UYARI: DEEPL_API_KEY çevre değişkeni bulunamadı!")
    print("Lütfen backend/.env dosyasını oluşturun ve DEEPL_API_KEY=your_api_key_here ekleyin")
    exit(1)

def translate_text_to_turkish(text, source_language):
    """
    DeepL API kullanarak metni seçilen dilden Türkçeye çevirir
    """
    try:
        response = requests.post(
            DEEPL_API_URL,
            headers={
                "Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={
                "text": text,
                "target_lang": "TR",
                "source_lang": source_language.upper()
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["translations"][0]["text"]
        else:
            print(f"DeepL API Hatası: {response.status_code} - {response.text}")
            return text  # Çeviri başarısızsa orijinal metni döndür
            
    except Exception as e:
        print(f"Çeviri hatası: {e}")
        return text  # Hata durumunda orijinal metni döndür


@app.route('/api/get-transcript', methods=['POST'])
def get_transcript_api():
    try:
        data = request.get_json()
        video_url = data.get('videoUrl', '')
        transcript_language = data.get('transcriptLanguage', 'en')
        
        print(f"Video URL: {video_url}")
        print(f"Seçilen transkript dili: {transcript_language}")

        # Video ID'yi çıkar
        if 'youtu.be' in video_url:
            video_id = video_url.split('/')[-1].split('?')[0]
        elif 'youtube.com' in video_url and 'v=' in video_url:
            video_id = video_url.split('v=')[1].split('&')[0]
        else:
            return jsonify({
                'success': False, 
                'error': 'Geçersiz YouTube URL formatı'
            }), 400

        if not video_id or len(video_id) != 11:
            return jsonify({
                'success': False, 
                'error': 'Geçersiz YouTube video ID'
            }), 400

        print(f"Video ID: {video_id}")

        # YouTube'dan transkript al
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id, 
            languages=[transcript_language]
        )
        
        if not transcript:
            return jsonify({
                'success': False, 
                'error': f'{transcript_language} dilinde transkript bulunamadı'
            }), 404

        print(f"Transkript alındı, {len(transcript)} satır bulundu")

        # Her transkript satırını Türkçeye çevir
        translated_transcript = []
        for i, entry in enumerate(transcript):
            original_text = entry['text']
            translated_text = translate_text_to_turkish(original_text, transcript_language)
            
            translated_transcript.append({
                'start': entry['start'],
                'duration': entry['duration'],
                'text': translated_text
            })
            
            print(f"Çevrildi {i+1}/{len(transcript)}: '{translated_text}'")

        return jsonify({
            'success': True, 
            'transcript': translated_transcript
        })

    except Exception as e:
        print(f"Genel hata: {e}")
        return jsonify({
            'success': False, 
            'error': f'Bir hata oluştu: {str(e)}'
        }), 500


if __name__ == '__main__':
    print("Flask sunucusu başlatılıyor...")
    print(f"DeepL API anahtarı yüklendi: {DEEPL_API_KEY[:10]}...")
    app.run(debug=True, host='0.0.0.0', port=5000) 