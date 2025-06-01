USE dublaj;
INSERT INTO users (email, password_hash)
VALUES ('test@example.com', 'hashedpassword');

INSERT INTO videos (user_id, title, language, translated_text)
VALUES (1, 'Test Video', 'EN', 'Bu bir test çevirisidir');

SELECT * FROM videos;

sys_config