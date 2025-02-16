import http from "http"
import https from "https"

async function fetchRSS(channelId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    https
      .get(url, (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => resolve(data))
      })
      .on("error", reject)
  })
}

function parseVideos(xml) {
  const videos = []
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || []

  for (const entry of entries) {
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || ""
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1] || ""
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || ""
    const thumbnail = entry.match(/<media:thumbnail url="(.*?)"/)?.[1] || ""
    const channelName = entry.match(/<author><name>(.*?)<\/name>/)?.[1] || ""

    videos.push({
      title: decodeHTMLEntities(title),
      link,
      published: new Date(published),
      thumbnail,
      channelName: decodeHTMLEntities(channelName),
    })
  }

  return videos
}

function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function generateHTML(videos) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feed</title>
            <link rel="icon" href="data:image/x-icon;base64,AAABAAEAAQEAAAEAIABGAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAABAAAAAQgGAAAAHxXEiQAAAA1JREFUeJxj+J/j/g8ABtECsftsr6UAAAAASUVORK5CYII=" />
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f1f1f1;
                }
                .videos {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .video-card {
                    background: white;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .video-card:hover {
                  background: #fdfdfd;
                }
                .thumbnail {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }
                .video-info {
                    padding: 15px;
                }
                .video-title {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                    line-height: 1.4;
                }
                .channel-name {
                    color: #606060;
                    font-size: 14px;
                    margin: 0 0 5px 0;
                }
                .video-date {
                    color: #909090;
                    font-size: 12px;
                }
                a { text-decoration: none;
                    color: inherit;
                }
            </style>
        </head>
        <body>
            <h1>Feed</h1>
            <div class="videos">
                ${videos
                  .map(
                    (video) => `
                    <a href="${video.link}" class="video-card" target="_blank">
                        <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}">
                        <div class="video-info">
                            <h2 class="video-title">${video.title}</h2>
                            <p class="channel-name">${video.channelName}</p>
                            <p class="video-date">${video.published.toLocaleDateString("fr-FR")}</p>
                        </div>
                    </a>
                `,
                  )
                  .join("")}
            </div>
        </body>
        </html>
    `
}

const channels = [
  // add channels id here, ex "UCjFqcJQXGZ6T6sxyFB-5i6A"
]

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    try {
      const feedPromises = channels.map(fetchRSS)
      const feeds = await Promise.all(feedPromises)
      const allVideos = feeds.flatMap(parseVideos)
      const sortedVideos = allVideos
        .sort((a, b) => b.published - a.published)
        .slice(0, 30)

      const html = generateHTML(sortedVideos)
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(html)
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end("Error fetching videos")
      console.error(error)
    }
  } else {
    res.writeHead(404)
    res.end()
  }
})

const PORT = 3003
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
