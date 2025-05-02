require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Yeni ve daha güvenilir transkript alma fonksiyonu
async function getYouTubeTranscript(videoId) {
  try {
    // YouTube sayfasını al
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Yeni regex pattern
    const ytInitialDataRegex = /ytInitialPlayerResponse\s*=\s*({.+?});\s*var/;
    const match = response.data.match(ytInitialDataRegex);
    
    if (!match) throw new Error('YouTube veri yapısı bulunamadı');

    const data = JSON.parse(match[1]);
    const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

    if (captionTracks.length === 0) {
      throw new Error('Bu videoda transkript bulunamadı');
    }

    const track = captionTracks.find(t => t.languageCode === 'en') || captionTracks[0];
    const transcriptUrl = track?.baseUrl;

    if (!transcriptUrl) {
      throw new Error('Transkript URL bulunamadı');
    }

    // Transkript XML'ini al
    const transcriptResponse = await axios.get(transcriptUrl);
    const $ = cheerio.load(transcriptResponse.data);
    
    const transcript = $('text').map((i, el) => ({
      text: $(el).text().replace(/&#39;/g, "'"),
      start: $(el).attr('start'),
      duration: $(el).attr('dur')
    })).get();

    return transcript;
  } catch (error) {
    console.error('Transkript hatası:', error);
    throw new Error(`Transkript alınamadı: ${error.message}`);
  }
}

app.post('/api/get-transcript', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    // Video ID'yi çıkar
    let videoId;
    if (videoUrl.includes('youtu.be')) {
      videoId = videoUrl.split('/').pop().split('?')[0];
    } else {
      videoId = new URL(videoUrl).searchParams.get('v');
    }

    if (!videoId || videoId.length !== 11) {
      throw new Error('Geçersiz YouTube video ID');
    }

    const transcript = await getYouTubeTranscript(videoId);
    res.json({ success: true, transcript });
    
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.listen(3001, () => {
  console.log('Sunucu çalışıyor: http://localhost:3001');
});