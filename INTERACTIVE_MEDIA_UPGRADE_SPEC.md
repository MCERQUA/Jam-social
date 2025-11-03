# Interactive Media Upgrade Specification
## Bringing SFTV Features to Jam Social Dashboard

**Date Created:** 2025-11-03
**Target:** jamsocial.app/dashboard user media assets
**Reference Implementation:** .SFTV project interactive video thumbnails

---

## 🎯 Overview

This specification details how to upgrade the Jam Social dashboard's media cards to include interactive features inspired by the SFTV website. The goal is to transform static thumbnails into engaging, interactive media previews with hover-to-play, audio controls, and click-to-enlarge functionality.

---

## 📊 Current State Analysis

### Jam-social Current Implementation
**File:** `/src/components/dashboard/MediaCard.tsx`

**Current Features:**
- Static thumbnail display (image-based)
- Hover state with quick actions (download, delete, favorite)
- Basic metadata display (resolution, file size, upload date)
- Click opens ImagePreview modal (images only)
- Simple play overlay for videos (no actual video preview)

**Current Limitations:**
- Videos show static thumbnail only (no preview on hover)
- Audio files have no playback preview
- No audio controls on thumbnails
- No auto-play on hover
- Limited engagement tracking

**Dependencies:**
```json
{
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.543.0",
  "react": "^19.1.1"
}
```

---

## 🌟 SFTV Reference Features

### SFTV Interactive Implementation
**File:** `/components/content-carousel.tsx` (VideoCard component)

**Key Interactive Features:**

### 1. **Hover-to-Play Video Preview**
- **Trigger:** Mouse enters card area (`onMouseEnter`)
- **Behavior:**
  - Video starts playing automatically
  - Thumbnail fades out (opacity-0)
  - Video scales slightly (group-hover:scale-105)
  - Muted by default
- **Exit:** Mouse leaves → video pauses, resets to start

**Code Reference (SFTV lines 92-139):**
```typescript
const handleMouseEnter = () => {
  setIsHovered(true)
  if (videoRef.current && item.videoPath) {
    videoRef.current.play().catch(() => {})
    setIsPlaying(true)
  }
}

const handleMouseLeave = () => {
  setIsHovered(false)
  if (videoRef.current) {
    videoRef.current.pause()
    videoRef.current.currentTime = 0
    setIsPlaying(false)
  }
}
```

### 2. **Audio Controls on Thumbnail**
- **Position:** Top-right corner
- **Visibility:**
  - Always visible on mobile
  - Fade in on hover for desktop (md:group-hover:opacity-100)
- **Controls:**
  - **Mute/Unmute Button:** Toggle video audio
  - **Expand Button:** Open full-screen modal

**Code Reference (SFTV lines 208-230):**
```typescript
<div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0
     transition-opacity duration-200 md:group-hover:opacity-100">
  <Button
    size="icon"
    variant="secondary"
    className="h-10 w-10 md:h-8 md:w-8 rounded-full bg-black/70 backdrop-blur"
    onClick={toggleMute}
  >
    {isMuted ? <VolumeX /> : <Volume2 />}
  </Button>
  <Button onClick={handleExpand}>
    <Maximize2 />
  </Button>
</div>
```

### 3. **Thumbnail Generation from Video**
- Automatically generates thumbnail if missing
- Extracts frame at 10 seconds or 10% of video duration
- Uses canvas API for frame extraction

**Code Reference (SFTV lines 66-90):**
```typescript
useEffect(() => {
  if (item.videoPath && (!item.thumbnail || thumbnailError)) {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(10, video.duration * 0.1)
    }
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      setVideoThumbnail(canvas.toDataURL('image/jpeg', 0.8))
    }
    video.src = item.videoPath
  }
}, [item.videoPath, item.thumbnail, thumbnailError])
```

### 4. **View Tracking System**
- Tracks video views after 3 seconds of playback
- Displays view count badge (bottom-left)
- Fetches view count on component mount

**Code Reference (SFTV lines 98-130):**
```typescript
// Track view after 3 seconds of play
if (!hasTrackedView) {
  setTimeout(() => {
    if (isPlaying && item.videoPath) {
      trackVideoView(item.videoPath, item.title)
      setHasTrackedView(true)
    }
  }, 3000)
}

// View count display
{viewCount !== null && viewCount > 0 && (
  <div className="absolute bottom-2 left-2 flex items-center gap-1
       rounded bg-black/70 px-2 py-1 text-xs">
    <Eye className="h-3 w-3" />
    {viewCount.toLocaleString()} views
  </div>
)}
```

### 5. **Play Icon Overlay**
- Centered on thumbnail when video not playing
- Fades out on hover (group-hover:opacity-0)
- White circular background with play icon

**Code Reference (SFTV lines 191-198):**
```typescript
{item.videoPath && !isPlaying && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center
         shadow-lg transition-opacity group-hover:opacity-0">
      <Play className="h-6 w-6 text-gray-900 ml-0.5" />
    </div>
  </div>
)}
```

### 6. **Layered Visual System**
- Thumbnail (background layer)
- Video element (foreground, hidden until playing)
- Overlays (controls, badges, play button)

**Code Reference (SFTV lines 160-189):**
```typescript
<div className="relative h-full w-full">
  {/* Thumbnail layer */}
  <img className={`absolute inset-0 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

  {/* Video layer */}
  <video ref={videoRef} className="absolute inset-0" muted={isMuted} loop playsInline />

  {/* Overlay layers */}
  {/* Play icon, controls, badges... */}
</div>
```

---

## 🚀 Implementation Requirements for Jam-social

### Phase 1: Enhanced Video Cards

#### A. State Management
Add these state variables to MediaCard component:

```typescript
const [isPlaying, setIsPlaying] = useState(false)
const [isMuted, setIsMuted] = useState(true)
const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
const [viewCount, setViewCount] = useState<number | null>(null)
const [hasTrackedView, setHasTrackedView] = useState(false)
const videoRef = useRef<HTMLVideoElement>(null)
```

#### B. Video Preview Implementation

**Required Changes:**
1. Replace static thumbnail div with layered system
2. Add hidden video element that plays on hover
3. Implement hover handlers

**Template:**
```typescript
const handleVideoHoverEnter = () => {
  if (item.fileType === 'video' && videoRef.current) {
    setIsHovered(true)
    videoRef.current.play().catch(err => console.log('Autoplay prevented:', err))
    setIsPlaying(true)

    // Start view tracking timer
    if (!hasTrackedView) {
      setTimeout(() => {
        if (isPlaying) {
          trackMediaView(item.id)
          setHasTrackedView(true)
        }
      }, 3000)
    }
  }
}

const handleVideoHoverLeave = () => {
  if (videoRef.current) {
    videoRef.current.pause()
    videoRef.current.currentTime = 0
    setIsPlaying(false)
    setIsHovered(false)
  }
}
```

#### C. Audio Controls Overlay

**Add to thumbnail section:**
```tsx
{item.fileType === 'video' && (
  <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0
       transition-opacity duration-200 md:group-hover:opacity-100 z-20">
    <button
      className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/80
                 border border-white/20 transition-all"
      onClick={(e) => {
        e.stopPropagation()
        if (videoRef.current) {
          videoRef.current.muted = !isMuted
          setIsMuted(!isMuted)
        }
      }}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
    </button>

    <button
      className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/80
                 border border-white/20 transition-all"
      onClick={(e) => {
        e.stopPropagation()
        setShowPreview(true)
      }}
      title="Expand"
    >
      <Maximize2 className="w-4 h-4 text-white" />
    </button>
  </div>
)}
```

### Phase 2: Audio File Support

#### A. Audio Card Component
Create new component: `/src/components/dashboard/AudioCard.tsx`

**Features:**
- Waveform visualization thumbnail
- Play/pause button on hover
- Progress indicator
- Volume control

**Basic Structure:**
```typescript
export const AudioCard: React.FC<{item: UserFile}> = ({ item }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      {/* Waveform visualization or audio icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Music className="w-16 h-16 text-purple-400 opacity-50" />
      </div>

      {/* Play overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={togglePlayPause} className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={item.filePath} onTimeUpdate={() => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
      }} />

      {/* Progress bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
          <div className="h-full bg-purple-500 transition-all" style={{width: `${progress}%`}} />
        </div>
      )}
    </div>
  )
}
```

### Phase 3: Enhanced Media Modal

#### A. Create Universal MediaPreview Component
Update or create new: `/src/components/dashboard/MediaPreview.tsx`

**Support for:**
- Images (existing functionality)
- Videos (with full controls)
- Audio (with waveform/controls)

**Video Modal Addition:**
```tsx
{file.fileType === 'video' && (
  <div className="relative max-w-[90vw] max-h-[90vh]">
    <video
      ref={videoModalRef}
      src={videoUrl}
      className="w-full h-full rounded-lg shadow-2xl"
      controls
      autoPlay
      onPlay={() => trackMediaView(file.id)}
    />

    {/* Video info overlay */}
    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-lg p-4">
      <h2 className="text-white font-semibold text-lg">{file.originalName}</h2>
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <span>{file.resolution}</span>
        <span>•</span>
        <span>{file.duration}</span>
        <span>•</span>
        <span>{file.fileSizeFormatted}</span>
      </div>
    </div>
  </div>
)}
```

### Phase 4: View Tracking System

#### A. Add View Tracking API Endpoint

**Create:** `/src/pages/api/media-views.ts` (or equivalent for your backend)

```typescript
// Track view
export async function trackView(mediaId: string, userId: string) {
  // Increment view count in database
  // Store view event with timestamp
  return { viewCount: updatedCount }
}

// Get view count
export async function getViewCount(mediaId: string) {
  // Return view count from database
  return { viewCount: count }
}
```

#### B. Integrate Tracking in MediaCard

```typescript
const trackMediaView = async (mediaId: string) => {
  try {
    const response = await apiClient.trackView(mediaId)
    setViewCount(response.viewCount)
  } catch (error) {
    console.error('Failed to track view:', error)
  }
}

// Fetch view count on mount
useEffect(() => {
  if (item.id) {
    apiClient.getViewCount(item.id)
      .then(data => setViewCount(data.viewCount))
      .catch(err => console.error('Failed to fetch views:', err))
  }
}, [item.id])
```

#### C. Display View Count Badge

```tsx
{viewCount !== null && viewCount > 0 && (
  <div className="absolute bottom-2 left-2 flex items-center gap-1.5
       bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white">
    <Eye className="w-3 h-3" />
    <span>{viewCount.toLocaleString()} views</span>
  </div>
)}
```

---

## 📐 Technical Specifications

### CSS Classes & Styling

**Key Styling Patterns from SFTV:**

```css
/* Layered positioning */
.relative.aspect-video { /* Container */ }
.absolute.inset-0 { /* Full coverage layers */ }

/* Transition effects */
.transition-opacity.duration-200 { /* Smooth fades */ }
.transition-transform.duration-300 { /* Smooth scaling */ }

/* Hover effects */
.group-hover\:scale-105 { /* Subtle zoom on hover */ }
.group-hover\:opacity-0 { /* Fade out elements */ }
.md\:group-hover\:opacity-100 { /* Desktop-only hover reveals */ }

/* Backdrop effects */
.bg-black\/70.backdrop-blur-sm { /* Frosted glass overlays */ }

/* Z-index layers */
z-10 { /* Controls layer */ }
z-20 { /* Top-most interactive elements */ }
```

### Video Element Configuration

```tsx
<video
  ref={videoRef}
  className="absolute inset-0 w-full h-full object-cover"
  muted={isMuted}
  loop
  playsInline
  preload="metadata"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

**Key Attributes:**
- `loop`: Continuous playback on hover
- `playsInline`: Mobile compatibility
- `preload="metadata"`: Fast load without full download
- `muted={isMuted}`: Controlled muting

### Responsive Behavior

**Desktop (md and up):**
- Controls fade in on hover
- Video plays on hover
- Smaller control buttons (w-8 h-8)

**Mobile:**
- Controls always visible
- Larger touch targets (w-10 h-10)
- No hover-to-play (tap to expand instead)

```tsx
className="h-10 w-10 md:h-8 md:w-8"  // Responsive sizing
className="opacity-100 md:opacity-0 md:group-hover:opacity-100"  // Responsive visibility
```

---

## 🎨 User Experience Flow

### Video Interaction Flow
1. **Initial State:** Static thumbnail with play icon overlay
2. **Hover Enter:**
   - Video loads and plays (muted)
   - Thumbnail fades out
   - Controls fade in (desktop)
   - Play icon disappears
3. **During Hover:**
   - User can toggle mute/unmute
   - User can click expand for full view
   - After 3 seconds, view is tracked
4. **Hover Exit:**
   - Video pauses and resets
   - Thumbnail fades back in
   - Controls fade out
   - Play icon returns

### Audio Interaction Flow
1. **Initial State:** Audio waveform/icon visualization
2. **Hover/Tap:**
   - Play button appears
   - Can play audio inline
3. **During Playback:**
   - Progress bar shows position
   - Can pause/resume
   - Can adjust volume
4. **Click Expand:**
   - Opens full audio player modal
   - Shows waveform visualization
   - Extended controls

---

## 🔧 Integration Steps

### Step 1: Update MediaCard Component
1. Import required icons from lucide-react
2. Add video state management
3. Add video ref and handlers
4. Update thumbnail section to layered system
5. Add control buttons overlay
6. Add view count badge

### Step 2: Update apiClient
Add methods in `/src/lib/api/client.ts`:
```typescript
async trackView(mediaId: string): Promise<{viewCount: number}>
async getViewCount(mediaId: string): Promise<{viewCount: number}>
async getVideoUrl(mediaId: string): Promise<string>
async getAudioUrl(mediaId: string): Promise<string>
```

### Step 3: Create/Update Backend Endpoints
- `POST /api/media-views` - Track view
- `GET /api/media-views?id={mediaId}` - Get view count
- Ensure authenticated video/audio streaming

### Step 4: Update MediaPreview Modal
- Add video player support
- Add audio player support
- Implement control overlays
- Add view tracking on modal open

### Step 5: Test All Media Types
- Test video hover-to-play
- Test audio playback
- Test modal expansion
- Test view tracking
- Test on mobile and desktop

---

## 📦 Required Dependencies

**Already Available in Jam-social:**
- ✅ `framer-motion` - Animations
- ✅ `lucide-react` - Icons (Volume2, VolumeX, Maximize2, Play, Pause, Eye)
- ✅ `react` - Core functionality

**May Need to Add:**
- Audio waveform library (optional): `wavesurfer.js` or `react-audio-player`
- Video thumbnail generation: Built-in using Canvas API (no extra deps)

---

## 🎯 Success Criteria

### Must Have:
- ✅ Videos play on hover (desktop)
- ✅ Mute/unmute controls visible
- ✅ Click to expand full modal
- ✅ View tracking functional
- ✅ Play icon overlay when not playing
- ✅ Smooth transitions and animations

### Should Have:
- ✅ Audio file preview support
- ✅ View count display
- ✅ Auto-generated thumbnails for videos
- ✅ Responsive mobile behavior
- ✅ Progress indicators

### Nice to Have:
- ⭐ Waveform visualization for audio
- ⭐ Keyboard shortcuts in modal
- ⭐ Share functionality
- ⭐ Engagement analytics

---

## 🚨 Important Considerations

### Performance
- Use `preload="metadata"` to avoid loading full videos
- Implement lazy loading for off-screen items
- Clean up video refs on unmount
- Revoke blob URLs to prevent memory leaks

### Accessibility
- Add ARIA labels to all buttons
- Support keyboard navigation
- Provide sr-only text for screen readers
- Ensure proper focus management in modals

### Mobile Optimization
- Disable hover-to-play on mobile (use tap instead)
- Larger touch targets (44px minimum)
- Always show controls on mobile
- Optimize video quality for mobile bandwidth

### Browser Compatibility
- Test autoplay policies across browsers
- Provide fallbacks for unsupported features
- Handle autoplay blocking gracefully
- Test video codec support

---

## 📝 Code Review Checklist

Before considering the upgrade complete:

- [ ] Videos auto-play on hover (desktop)
- [ ] Videos pause and reset on mouse leave
- [ ] Mute/unmute toggle works
- [ ] Expand button opens modal
- [ ] Play icon shows when video not playing
- [ ] View tracking increments after 3 seconds
- [ ] View count displays correctly
- [ ] Controls fade in/out smoothly
- [ ] Thumbnail generation works for videos
- [ ] Audio files have playback preview
- [ ] Modal supports video and audio
- [ ] Responsive behavior correct on mobile
- [ ] No memory leaks (cleanup refs/URLs)
- [ ] Accessibility requirements met
- [ ] Error handling implemented
- [ ] Console errors resolved

---

## 📚 Reference Files

### SFTV Source Files:
- `/mnt/HC_Volume_103321268/isolated-projects/.SFTV/components/content-carousel.tsx` (lines 35-233)
- `/mnt/HC_Volume_103321268/isolated-projects/.SFTV/components/video-modal.tsx`
- `/mnt/HC_Volume_103321268/isolated-projects/.SFTV/components/video-thumbnail.tsx`

### Jam-social Target Files:
- `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/src/components/dashboard/MediaCard.tsx`
- `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/src/components/dashboard/ImagePreview.tsx`
- `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/src/pages/dashboard.astro`

---

## 🤝 Support & Questions

When implementing this upgrade, refer to:
1. This specification document
2. SFTV reference implementation
3. Existing Jam-social patterns
4. React and Astro documentation

For questions about Jam-social specific implementation details, consult the project's internal documentation and existing component patterns.

---

**End of Specification**
