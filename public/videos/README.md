# Video Carousel Content

Add your video files to this folder for the video carousel showcase.

## Supported Formats
- MP4 (recommended)
- WebM
- MOV

## Naming Convention
Name your video files descriptively, for example:
- `social-media-campaign.mp4`
- `viral-content-example.mp4`
- `brand-promotion.mp4`

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