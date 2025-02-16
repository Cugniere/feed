# Feed

A minimalistic, zero-dependency RSS reader for YouTube that lists the latest videos from your favorite channels.

![Feed screenshot](../assets/feed-screenshot.webp?raw=true)

## Features

- No external dependencies - uses only Node.js built-in modules
- Fetches latest videos using YouTube's RSS feeds
- Displays videos in a responsive grid layout
- Shows thumbnails, titles, channel names, and publication dates
- Orders videos by publication date
- Lightweight and fast

## Installation

1. Clone this repository or download `feed.js`
2. Make sure you have Node.js installed on your system
3. No npm install needed!

## Usage

1. Open `feed.js` in your text editor
2. Add your YouTube channel IDs to the `channels` array:

```javascript
const channels = [
    "UCjFqcJQXGZ6T6sxyFB-5i6A"   // Every Frame a Painting
]
```

3. Run the script:

```bash
node index.mjs
```

4. Open your browser and visit `http://localhost:3003`

## Finding Channel IDs

There are several ways to find a YouTube channel ID:

1. **From the channel page:**
   - Go to the channel's YouTube page
   - View the page source (right-click > View Page Source)
   - Search for "channelId"

2. **From the RSS feed:**
   - Go to the channel's YouTube page
   - View the page source
   - Search for "RSS" and look for a URL like `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`

3. **Using a third-party tool:**
   - Various websites can extract channel IDs from YouTube URLs
   - Search for "YouTube channel ID finder"

## Customization

### Change the number of videos displayed

Find this line in the code:

```javascript
.slice(0, 30)
```

Change `30` to your desired number of videos.

### Change the port

Find this line:

```javascript
const PORT = 3003
```

Change `3000` to your desired port number.

## How It Works

1. The script creates a simple HTTP server using Node.js
2. When you visit the page, it fetches RSS feeds from all configured YouTube channels
3. The XML feeds are parsed to extract video information
4. Videos from all channels are combined and sorted by date
5. The latest videos are displayed in a responsive grid layout
6. The page automatically refreshes when reloaded to show the latest videos

## Performance

- RSS feeds are fetched in parallel for better performance
- No database required - data is fetched fresh on each page load
- Minimal memory usage
- Fast page load times due to minimal dependencies

## Limitations

- YouTube RSS feeds typically only include the latest 15 videos per channel
- The script doesn't cache results between page loads
- Requires manual addition of channel IDs

## Contributing

Feel free to:
- Submit issues for bugs or feature requests
- Create pull requests with improvements
- Share your customizations

## License

MIT License - feel free to use this code in your own projects!