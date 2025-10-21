# Asset Organization System
## Digital Asset Management for AI-Driven Video Production

**Last Updated:** October 20, 2025
**Status:** Database migrated ✅ | UI pending 🚧

---

## Overview

This system transforms the file storage into a comprehensive **Digital Asset Management (DAM)** platform designed for AI-driven video production workflows. Assets are organized for easy discovery, compositing, and AI integration.

---

## Asset Categories

### **Visual Assets**

#### 1. **Characters** (`character`)
- People, mascots, brand characters
- **Examples:**
  - Mascot in various poses
  - Brand spokesperson
  - Animated characters
- **Metadata:**
  - `character_names`: Array of character names
  - `usage_tags`: `[talking, static, animated, greenscreen]`

#### 2. **Objects** (`object`)
- Products, vehicles, props
- **Examples:**
  - Trucks with wraps
  - Product bottles
  - Logo variations
- **Metadata:**
  - `object_description`: "Blue Ford F-150 with Koolfoam wrap"
  - `has_alpha_channel`: true/false

#### 3. **Scenes** (`scene`)
- Locations, backgrounds, environments
- **Examples:**
  - Office interiors
  - Street exteriors
  - Studio setups
- **Metadata:**
  - `scene_location`: "Office interior - Conference Room A"

#### 4. **Greenscreen** (`greenscreen`)
- Chromakey footage ready for compositing
- **Examples:**
  - Character talking on green
  - Object isolated on green
  - Action sequences on green
- **Metadata:**
  - `has_alpha_channel`: true (after keying)
  - `usage_tags`: `[greenscreen, ai_ready]`

#### 5. **Backgrounds** (`background`)
- Pre-rendered backgrounds for compositing
- **Examples:**
  - City skyline
  - Abstract patterns
  - Nature scenes
- **Metadata:**
  - `resolution`: "4K", "HD"
  - `usage_tags`: `[4k, web_optimized]`

#### 6. **Full Videos** (`full_video`)
- Complete productions ready to publish
- **Examples:**
  - 30s commercial (final)
  - Social media video (final)
- **Metadata:**
  - `package_name`: Associated client package

#### 7. **Clips** (`clip`)
- Reusable segments, b-roll
- **Examples:**
  - 3s transition clips
  - B-roll footage
  - Stock footage
- **Metadata:**
  - `usage_tags`: `[web_optimized, transition]`

#### 8. **Templates** (`template`)
- Editable templates with placeholders
- **Examples:**
  - Lower third templates
  - Title card templates
  - Intro/outro templates
- **Metadata:**
  - `ai_metadata.template_data`: Template configuration

---

### **Audio Assets** (`audio`)

#### 1. **Logo Jingles** (`jingle`)
- **Duration:** 10-15 seconds
- **Description:** 1-2 sentence branded audio signatures
- **Examples:**
  - Brand name sing-song
  - Musical logo sting
- **Metadata:**
  - `audio_duration_seconds`: 10-15
  - `audio_lyrics`: "Koolfoam - Keeping things cool!"
  - `audio_style`: "upbeat", "memorable"
  - `audio_vocals`: true
  - `audio_tempo`: 120 BPM
  - `audio_key`: "C Major"

#### 2. **Commercial Songs** (`commercial_song`)
- **Duration:** 30-60 seconds
- **Description:** Full production music for commercials
- **Examples:**
  - 30s ad music
  - Product feature song
- **Metadata:**
  - `audio_duration_seconds`: 30-60
  - `audio_lyrics`: Full song lyrics
  - `audio_style`: "energetic", "corporate"
  - `audio_vocals`: true

#### 3. **Radio Songs** (`radio_song`)
- **Duration:** Varies (typically 30s, 60s, 90s)
- **Description:** Radio-ready tracks
- **Examples:**
  - Radio spot music
  - Radio jingles
- **Metadata:**
  - `audio_duration_seconds`: 30, 60, 90
  - `audio_style`: "catchy", "radio-friendly"

#### 4. **Voice Overs** (`voiceover`)
- **Description:** Narration, announcements
- **Examples:**
  - Product narration
  - Announcer voice
  - Character voices
- **Metadata:**
  - `voiceover_type`: "male", "female", "character", "narration"
  - `voiceover_script`: Full transcript
  - `audio_style`: "professional", "friendly", "authoritative"

#### 5. **Sound Effects** (`sfx`)
- **Description:** Impacts, transitions, foley
- **Examples:**
  - Whoosh sounds
  - Button clicks
  - Impact sounds

#### 6. **Background Music** (`background_music`)
- **Description:** Instrumental beds
- **Examples:**
  - Corporate background track
  - Upbeat underscore
- **Metadata:**
  - `audio_vocals`: false
  - `audio_tempo`: 100 BPM
  - `audio_key`: "G Major"

---

## Usage Tags

Multi-dimensional classification for all assets:

### **Content State**
- `talking` - Character speaking
- `static` - Still/posed
- `animated` - Motion/action

### **Background Status**
- `with_background` - Already composited
- `greenscreen` - On green screen
- `alpha_channel` - Has transparency

### **Quality & Optimization**
- `4k` - 4K resolution
- `hd` - HD resolution
- `web_optimized` - Compressed for web

### **AI Readiness**
- `ai_ready` - Formatted for AI tools
- `motion_tracked` - Has motion tracking data
- `facial_markers` - Face landmarks included

---

## AI Metadata Structure

```json
{
  "ai_metadata": {
    "is_ai_ready": true,
    "has_alpha": true,
    "compositing_data": {
      "dimensions": "1920x1080",
      "frame_rate": 30,
      "codec": "ProRes 4444",
      "color_space": "Rec. 709"
    },
    "character_data": {
      "names": ["Mike the Mascot"],
      "poses": ["talking", "waving", "pointing"],
      "emotions": ["happy", "excited", "confident"],
      "facial_markers": {
        "landmarks": [...],
        "expressions": [...]
      }
    },
    "scene_data": {
      "type": "greenscreen",
      "lighting": "studio_3point",
      "camera_angle": "front",
      "background_color": "#00FF00"
    },
    "template_data": {
      "placeholders": ["title", "subtitle", "logo"],
      "editable_layers": ["text", "color", "position"]
    }
  }
}
```

---

## Customer Content Organization

### Per-Customer Asset Structure

For each customer project, they receive:

1. **Character Images**
   - Mascot/brand character in various poses
   - With and without backgrounds
   - Greenscreen versions

2. **Object Assets**
   - Products (bottles, boxes, etc.)
   - Vehicles with wraps (trucks, vans)
   - Props and set pieces

3. **Scene Elements**
   - Location footage
   - Background plates
   - Environment stills

4. **Greenscreen Footage**
   - Characters talking (various emotions)
   - Characters with actions
   - Object demonstrations

5. **Composited Footage**
   - Characters with backgrounds
   - Full scene compositions
   - Ready-to-edit clips

6. **Audio Assets**
   - Logo jingle (10-15s)
   - Commercial songs (30s, 60s)
   - Voice over clips
   - Background music

7. **Complete Videos**
   - Sample commercials
   - Social media videos
   - Educational content

---

## Dashboard Organization

### Sidebar Navigation

```
📊 Dashboard
├─ All Assets (total count)
├─ Recent Uploads
└─ Favorites

🎬 Visual Assets
├─ Characters
├─ Objects
├─ Scenes
├─ Greenscreen
├─ Backgrounds
├─ Full Videos
├─ Clips
└─ Templates

🎵 Audio Assets
├─ Logo Jingles
├─ Commercial Songs
├─ Radio Songs
├─ Voice Overs
├─ Sound Effects
└─ Background Music

🏷️ Filter by Tags
├─ Talking
├─ Static
├─ Alpha Channel
├─ AI Ready
├─ 4K Quality
└─ Web Optimized

📦 Packages
└─ [Customer projects]
```

---

## Future AI Integration

This system is designed to integrate with:

### **AI Video Tools**
- Automated compositing (greenscreen → background)
- Character animation from still images
- Scene generation and modification
- Style transfer and effects

### **AI Audio Tools**
- Voice synthesis from scripts
- Music generation from style
- Audio cleanup and enhancement
- Automated mixing

### **AI Content Creation**
- Template population from assets
- Automated video assembly
- Social media content generation
- Multi-platform optimization

---

## Technical Implementation

### Database Schema
- **Table:** `user_files`
- **New Columns:** 15+ metadata fields
- **Indexes:** GIN indexes on arrays and JSONB
- **Migration:** `002_add_asset_organization.sql`

### API Updates Needed
- ✅ Database schema
- 🚧 Upload endpoint (metadata capture)
- 🚧 Search/filter endpoint (category/tag queries)
- 🚧 AI metadata endpoint (for AI tools)

### UI Updates Needed
- 🚧 FileUploader (category/tag selection)
- 🚧 Sidebar (new navigation)
- 🚧 MediaCard (display categories/tags)
- 🚧 Filters (advanced search)

---

## Usage Examples

### Example 1: Logo Jingle Upload
```javascript
{
  file_type: "audio",
  asset_category: "audio",
  audio_category: "jingle",
  audio_duration_seconds: 12,
  audio_style: "upbeat",
  audio_vocals: true,
  audio_lyrics: "Koolfoam - Keeping things cool! The foam you trust!",
  audio_tempo: 120,
  audio_key: "C Major",
  usage_tags: ["brand", "signature"],
  package_name: "Koolfoam Brand Package 2025"
}
```

### Example 2: Character Greenscreen Upload
```javascript
{
  file_type: "video",
  asset_category: "greenscreen",
  character_names: ["Mike the Mascot"],
  usage_tags: ["talking", "greenscreen", "ai_ready"],
  has_alpha_channel: false, // Will be true after keying
  ai_metadata: {
    scene_data: {
      type: "greenscreen",
      lighting: "studio",
      camera_angle: "front"
    },
    character_data: {
      poses: ["talking"],
      emotions: ["friendly", "welcoming"]
    }
  },
  package_name: "Koolfoam Brand Package 2025"
}
```

### Example 3: Product Object Upload
```javascript
{
  file_type: "image",
  asset_category: "object",
  object_description: "Koolfoam insulation bottle - 16oz silver",
  has_alpha_channel: true,
  resolution: "4096x4096",
  usage_tags: ["product", "alpha_channel", "4k", "ai_ready"],
  package_name: "Product Library 2025"
}
```

---

## Next Steps

1. ✅ **Database Migration** - Complete
2. 🚧 **FileUploader UI** - Add category/tag selection
3. 🚧 **Sidebar Navigation** - Update with new categories
4. 🚧 **Search & Filters** - Implement advanced filtering
5. 🚧 **API Endpoints** - Update to support new metadata
6. 🚧 **Documentation** - User guide for customers

---

**Ready for AI-driven video production workflows!** 🚀
