import sys
from youtube_transcript_api import YouTubeTranscriptApi


def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except Exception as e:
        print(f'Transkript alınamadı: {e}')
        return None


def main(video_url):
    # Video ID'yi çıkar
    if 'youtu.be' in video_url:
        video_id = video_url.split('/')[-1].split('?')[0]
    else:
        video_id = video_url.split('v=')[-1].split('&')[0]

    if not video_id or len(video_id) != 11:
        print('Geçersiz YouTube video ID')
        return

    transcript = get_transcript(video_id)
    if transcript:
        for entry in transcript:
            print(f"{entry['start']} - {entry['duration']}: {entry['text']}")


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Kullanım: python youtube_transcript.py <YouTube Video URL>')
    else:
        main(sys.argv[1]) 