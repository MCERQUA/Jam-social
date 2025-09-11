# Video Carousel Content

Add your video files and thumbnails to this folder for the video carousel showcase.

## How It Works
- Videos are NOT loaded until a user clicks to play them
- Only thumbnails are shown initially for fast page loading
- Clicking a thumbnail opens a modal with the actual video

## Supported Formats
- **Videos**: MP4 (recommended), WebM, MOV
- **Thumbnails**: JPG, PNG, WebP (recommended)

## Naming Convention
Name your files descriptively, for example:
- Videos: `social-media-campaign.mp4`, `viral-content.mp4`
- Thumbnails: `social-media-campaign-thumb.jpg`, `viral-content-thumb.jpg`

## File Size Recommendations
- Keep videos under 10MB for optimal loading
- Consider compressing videos for web using tools like HandBrake
- Use 1080p or 720p resolution for best balance of quality and performance

## How to Add Videos
1. Place your video files directly in this `/public/videos/` folder
2. Update the `VideoShowcase.tsx` component to reference your videos
3. Videos will be accessible at `/videos/your-video-name.mp4`

## Example Video Reference
```javascript
const videos = [
  {
    id: "1",
    title: "Your Video Title",
    url: "/videos/your-video-name.mp4",
    thumbnail: "/videos/your-thumbnail.jpg" // optional
  }
];
```