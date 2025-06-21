from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
from flask_mail import Mail, Message
import requests
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime, timedelta
import secrets

# .env dosyasını yükle
load_dotenv()

app = Flask(__name__)
CORS(app)

# MAIL yapılandırması .env'den
app.config.update(
    MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
    MAIL_PORT=int(os.getenv('MAIL_PORT', 587)),
    MAIL_USE_TLS=os.getenv('MAIL_USE_TLS', 'True').lower() == 'true',
    MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
    MAIL_DEFAULT_SENDER=os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))
)
mail = Mail(app)

# Veritabanı bağlantısı
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_NAME = os.getenv('DB_NAME')

try:
    db_url = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(db_url)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ Veritabanı bağlantısı başarılı")
except Exception as db_error:
    print(f"⚠️ Veritabanı bağlantı hatası: {str(db_error)}")
    print("ℹ️ Çeviri işlemleri çalışacak, ancak veriler kaydedilmeyecek")
    engine = None

# DeepL API bilgileri
DEEPL_API_KEY = os.getenv('DEEPL_API_KEY')
DEEPL_API_URL = os.getenv('DEEPL_API_URL', 'https://api-free.deepl.com/v2/translate')

if not DEEPL_API_KEY:
    print("UYARI: DEEPL_API_KEY çevre değişkeni bulunamadı!")
    exit(1)

def translate_text_to_turkish(text, source_language, user_id, title):
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
            translated_text_result = result["translations"][0]["text"]

            try:
                if engine is not None:
                    with engine.connect() as conn:
                        conn.execute(text("""
                            INSERT INTO videos (user_id, title, language, translated_text)
                            VALUES (:user_id, :title, :language, :translated_text)
                        """), {
                            "user_id": user_id,
                            "title": title,
                            "language": source_language,
                            "translated_text": translated_text_result
                        })
                    print(f"✅ Veritabanına kaydedildi: {translated_text_result[:50]}...")
                else:
                    print("ℹ️ Veritabanı bağlantısı yok, kayıt atlanıyor")
            except Exception as db_error:
                print(f"⚠️ Veritabanı kayıt hatası (çeviri devam ediyor): {str(db_error)}")

            return translated_text_result
        else:
            print(f"DeepL API Hatası: {response.status_code} - {response.text}")
            return text
    except Exception as e:
        print(f"Çeviri Hatası: {str(e)}")
        return text

@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"}), 500

    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"status": "error", "message": "E-posta gerekli"}), 400

    with engine.connect() as conn:
        user = conn.execute(text("SELECT user_id FROM users WHERE email = :email"), {"email": email}).mappings().fetchone()

        if not user:
            return jsonify({"status": "success", "message": "Eğer bu e-posta kayıtlıysa talimatlar gönderildi."})

        token = str(uuid.uuid4())
        expiry = datetime.utcnow() + timedelta(hours=1)

        conn.execute(text("""
            UPDATE users SET reset_token = :token, reset_token_expiry = :expiry WHERE user_id = :user_id
        """), {"token": token, "expiry": expiry, "user_id": user["user_id"]})

    reset_link = f"{os.getenv('FRONTEND_BASE_URL','http://localhost:3000')}/reset-password?token={token}"

    try:
        msg = Message(
            subject="Şifre Sıfırlama Talimatları",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[email],
            body=f"Şifrenizi sıfırlamak için lütfen şu linke tıklayın:\n\n{reset_link}\n\nLink 1 saat geçerlidir."
        )
        mail.send(msg)
    except Exception as e:
        print("E-posta gönderme hatası:", e)
        return jsonify({"status": "error", "message": "E-posta gönderilemedi"}), 500

    return jsonify({"status": "success", "message": "Eğer bu e-posta kayıtlıysa talimatlar gönderildi."})

@app.route("/api/reset-password", methods=["POST"])
def request_password_reset():
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"}), 500
    
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"status": "error", "message": "E-posta gereklidir"}), 400

    try:
        with engine.begin() as conn:
            user = conn.execute(
                text("SELECT user_id FROM users WHERE email = :email"),
                {"email": email}
            ).mappings().fetchone()

            if not user:
                return jsonify({"status": "success", "message": "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."})

            reset_token = secrets.token_urlsafe(32)
            expiry = datetime.utcnow() + timedelta(hours=1)  # Token 1 saat geçerli

            conn.execute(text("""
                UPDATE users SET reset_token = :token, reset_token_expiry = :expiry WHERE user_id = :user_id
            """), {"token": reset_token, "expiry": expiry, "user_id": user["user_id"]})

            reset_link = f"{os.getenv('FRONTEND_BASE_URL')}/reset-password/{reset_token}"

            msg = Message(
                subject="Şifre Sıfırlama Talebi",
                sender=os.getenv("MAIL_DEFAULT_SENDER"),
                recipients=[email]
            )
            msg.body = f"Merhaba,\n\nŞifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayın:\n{reset_link}\n\nBu link 1 saat geçerlidir.\n\nİyi günler!"
            mail.send(msg)

        return jsonify({"status": "success", "message": "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Hata oluştu: {str(e)}"}), 500


@app.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"}), 500

    data = request.json
    new_password = data.get("password") or data.get("new_password")

    if not token or not new_password:
        return jsonify({"status": "error", "message": "Token ve yeni şifre gerekli"}), 400

    try:
        with engine.begin() as conn:
            user = conn.execute(text("""
                SELECT user_id, reset_token_expiry FROM users WHERE reset_token = :token
            """), {"token": token}).mappings().fetchone()

            if not user:
                return jsonify({"status": "error", "message": "Geçersiz token"}), 400

            if user["reset_token_expiry"] < datetime.utcnow():
                return jsonify({"status": "error", "message": "Token süresi dolmuş"}), 400

            hashed_pw = generate_password_hash(new_password)

            conn.execute(text("""
                UPDATE users SET password_hash = :pw, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = :user_id
            """), {"pw": hashed_pw, "user_id": user["user_id"]})

        return jsonify({"status": "success", "message": "Şifre başarıyla değiştirildi."})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Hata oluştu: {str(e)}"}), 500

# --- Mevcut API'ler ---

@app.route("/register", methods=["POST"])
def register():
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"}), 500

    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"status": "error", "message": "Tüm alanlar zorunludur"}), 400

    password_hash = generate_password_hash(password)

    try:
        with engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO users (name, email, password_hash)
                VALUES (:name, :email, :password_hash)
            """), {"name": name, "email": email, "password_hash": password_hash})
        return jsonify({"status": "user_created"})
    except Exception as e:
        print("Kayıt hatası:", e)
        return jsonify({"status": "error", "message": "Kayıt başarısız, hata: " + str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"})

    data = request.json
    email = data.get("email")
    password = data.get("password")

    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT user_id, password_hash FROM users WHERE email = :email
        """), {"email": email}).mappings().fetchone()

    if result and check_password_hash(result['password_hash'], password):
        return jsonify({"status": "success", "user_id": result['user_id']})
    else:
        return jsonify({"status": "fail", "message": "Invalid credentials"})


@app.route("/user/<int:user_id>", methods=["GET"])
def get_user_info(user_id):
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"})

    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT name, email FROM users WHERE user_id = :user_id
        """), {"user_id": user_id}).mappings().fetchone()

        if result:
            return jsonify({
                "status": "success",
                "user": {
                    "name": result['name'],
                    "email": result['email']
                }
            })
        else:
            return jsonify({"status": "fail", "message": "Kullanıcı bulunamadı"})


@app.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    if engine is None:
        return jsonify({"status": "error", "message": "Veritabanı bağlantısı yok"})

    data = request.json
    name = data.get("name")
    email = data.get("email")

    try:
        with engine.begin() as conn:  
            conn.execute(text("""
                UPDATE users SET name = :name, email = :email WHERE user_id = :user_id
            """), {"name": name, "email": email, "user_id": user_id})

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route("/videos", methods=["GET"])
def get_all_videos():
    if engine is None:
        return jsonify({"error": "Veritabanı bağlantısı yok"})

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM videos"))
            data = [dict(row) for row in result]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text")
    source_language = data.get("source_language")
    user_id = data.get("user_id")
    title = data.get("title")

    translated_text = translate_text_to_turkish(text, source_language, user_id, title)

    return jsonify({"translated": translated_text})


@app.route('/api/get-transcript', methods=['POST'])
def get_transcript_api():
    try:
        data = request.get_json()
        video_url = data.get('videoUrl', '')
        transcript_language = data.get('transcriptLanguage', 'en')
        user_id = data.get('user_id', 1)

        print(f"Video URL: {video_url}")
        print(f"Seçilen transkript dili: {transcript_language}")

        if 'youtu.be' in video_url:
            video_id = video_url.split('/')[-1].split('?')[0]
        elif 'youtube.com' in video_url and 'v=' in video_url:
            video_id = video_url.split('v=')[1].split('&')[0]
        else:
            return jsonify({'success': False, 'error': 'Geçersiz YouTube URL formatı'}), 400

        if not video_id or len(video_id) != 11:
            return jsonify({'success': False, 'error': 'Geçersiz YouTube video ID'}), 400

        print(f"Video ID: {video_id}")

        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[transcript_language])

        if not transcript:
            return jsonify({'success': False, 'error': f'{transcript_language} dilinde transkript bulunamadı'}), 404

        print(f"Transkript alındı, {len(transcript)} satır bulundu")

        video_title = f"YouTube Video {video_id}"

        translated_transcript = []
        for i, entry in enumerate(transcript):
            original_text = entry['text']
            translated_text = translate_text_to_turkish(original_text, transcript_language, user_id, video_title)
            translated_transcript.append({
                'start': entry['start'],
                'duration': entry['duration'],
                'text': translated_text
            })
            print(f"Çevrildi {i+1}/{len(transcript)}: '{translated_text}'")

        return jsonify({'success': True, 'transcript': translated_transcript})

    except Exception as e:
        print(f"Genel hata: {e}")
        return jsonify({'success': False, 'error': f'Bir hata oluştu: {str(e)}'}), 500


if __name__ == '__main__':
    print("Flask sunucusu başlatılıyor...")
    print(f"DeepL API anahtarı yüklendi: {DEEPL_API_KEY[:10]}...")
    app.run(debug=True, host='0.0.0.0', port=5000)
