# User Dashboard Design Specification
## Jam Social Media - Media Management Dashboard

---

## 🎯 Overview

A comprehensive media management dashboard combining the best features of Canva, YouTube, and Google Drive for seamless asset discovery, organization, and download.

---

## 📐 Layout Structure

### Main Layout Components

```
┌─────────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                         │
│  [Logo] [Search] [Upload] [Profile] [Notifications]        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │         Main Content Area                       │
│          │                                                  │
│ - Home   │  ┌────────────────────────────────┐            │
│ - Videos │  │  Filters & Sort Controls       │            │
│ - Images │  └────────────────────────────────┘            │
│ - Scenes │                                                 │
│ - Projects│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                     │
│ - Packages│  │   │ │   │ │   │ │   │  Media Grid         │
│ - Shared │  └───┘ └───┘ └───┘ └───┘                     │
│ - Trash  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐                     │
│          │  │   │ │   │ │   │ │   │                     │
│          │  └───┘ └───┘ └───┘ └───┘                     │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

---

## 🎨 Design System

### Color Palette (Matching Brand)
```css
/* Primary Colors */
--purple-500: #a855f7;
--pink-500: #ec4899;
--blue-500: #3b82f6;

/* Dashboard Specific */
--sidebar-bg: rgba(17, 24, 39, 0.95);  /* gray-900/95 */
--content-bg: #000000;
--card-bg: rgba(31, 41, 55, 0.6);      /* gray-800/60 */
--card-hover: rgba(55, 65, 81, 0.8);   /* gray-700/80 */
--border: rgba(107, 114, 128, 0.2);    /* gray-500/20 */

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography
- **Headings**: Inter, system-ui
- **Body**: Inter, sans-serif
- **Mono**: JetBrains Mono (for metadata)

---

## 📋 Component Breakdown

### 1. Sidebar Navigation

#### Structure
```jsx
<Sidebar>
  <Logo />
  <StorageIndicator />

  <NavSection title="Main">
    - Home (all media)
    - Recent
    - Favorites
  </NavSection>

  <NavSection title="Media Types">
    - Videos
    - Images
    - Scenes
    - Projects
    - 3D Assets
    - Audio
  </NavSection>

  <NavSection title="Organization">
    - Packages
    - Collections
    - Shared with me
    - Trash
  </NavSection>

  <UploadButton />
</Sidebar>
```

#### Features
- Collapsible sections
- Active state highlighting
- Item count badges
- Drag-drop upload area
- Storage usage bar (GB used / Total GB)

#### Styling
```css
.sidebar {
  width: 280px;
  background: linear-gradient(180deg,
    rgba(17, 24, 39, 0.98) 0%,
    rgba(17, 24, 39, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(107, 114, 128, 0.2);
}

.nav-item {
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(168, 85, 247, 0.1);
}

.nav-item.active {
  background: linear-gradient(90deg, #ec4899 0%, #a855f7 100%);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}
```

---

### 2. Top Navigation Bar

#### Structure
```jsx
<TopBar>
  <LogoSection>
    <HamburgerMenu /> {/* Mobile only */}
    <Logo />
  </LogoSection>

  <SearchBar>
    <SearchIcon />
    <Input placeholder="Search your media..." />
    <FilterToggle />
  </SearchBar>

  <Actions>
    <UploadButton primary />
    <NotificationsDropdown />
    <UserMenu>
      <Avatar />
      <Dropdown>
        - Settings
        - Billing
        - Help
        - Logout
      </Dropdown>
    </UserMenu>
  </Actions>
</TopBar>
```

#### Features
- Global search (searches all media)
- Advanced filters
- Upload button (primary CTA)
- Notifications center
- User profile dropdown

---

### 3. Filter & Sort Controls

#### Structure
```jsx
<FilterBar>
  <ViewToggle>
    - Grid View (default)
    - List View
    - Gallery View
  </ViewToggle>

  <SortDropdown>
    - Date Modified (newest)
    - Date Modified (oldest)
    - Name (A-Z)
    - Name (Z-A)
    - Size (largest)
    - Size (smallest)
    - Type
  </SortDropdown>

  <FilterOptions>
    <TypeFilter>
      - All
      - Videos
      - Images
      - Scenes
      - Projects
    </TypeFilter>

    <DateFilter>
      - Today
      - Last 7 days
      - Last 30 days
      - Last 90 days
      - Custom range
    </DateFilter>

    <PackageFilter>
      - All Packages
      - Bronze Package
      - Silver Package
      - Gold Package
      - Platinum Package
      - Custom Assets
    </PackageFilter>

    <TagFilter>
      - Show by tags
    </TagFilter>
  </FilterOptions>

  <BulkActions> {/* Shows when items selected */}
    - Download Selected
    - Move to Collection
    - Add Tags
    - Delete
  </BulkActions>
</FilterBar>
```

---

### 4. Media Grid / List View

#### Grid View (Default - YouTube/Canva Style)

```jsx
<MediaGrid columns={4}> {/* Responsive: 1-4 columns */}
  <MediaCard>
    <Thumbnail>
      <Image/Video preview />
      <PlayOverlay /> {/* For videos */}
      <DurationBadge>00:15</DurationBadge>
      <TypeBadge>Video</TypeBadge>
    </Thumbnail>

    <CardContent>
      <Title>Product Demo - Final Cut</Title>
      <Metadata>
        <Date>2 days ago</Date>
        <Size>24.5 MB</Size>
        <Resolution>1920x1080</Resolution>
      </Metadata>
      <Tags>
        <Tag>Product</Tag>
        <Tag>Demo</Tag>
      </Tags>
    </CardContent>

    <CardActions>
      <QuickActions>
        <IconButton icon="download" tooltip="Download" />
        <IconButton icon="share" tooltip="Share" />
        <IconButton icon="edit" tooltip="Edit" />
        <IconButton icon="heart" tooltip="Favorite" />
      </QuickActions>
      <MoreMenu>
        - Preview
        - Download
        - Edit Details
        - Move to Collection
        - Add Tags
        - Share
        - Get Link
        - Delete
      </MoreMenu>
    </CardActions>

    <SelectCheckbox /> {/* Top-left corner */}
  </MediaCard>
</MediaGrid>
```

#### Grid Card Styling
```css
.media-card {
  background: rgba(31, 41, 55, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(107, 114, 128, 0.2);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-card:hover {
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(168, 85, 247, 0.4);
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(168, 85, 247, 0.2);
}

.thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
}

.thumbnail img,
.thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
}

.media-card:hover .play-overlay {
  opacity: 1;
}
```

#### List View (Google Drive Style)

```jsx
<MediaList>
  <ListHeader>
    <Column sort="name">Name</Column>
    <Column sort="type">Type</Column>
    <Column sort="size">Size</Column>
    <Column sort="modified">Modified</Column>
    <Column>Actions</Column>
  </ListHeader>

  <ListRow>
    <Thumbnail small />
    <Name>Product Demo - Final Cut.mp4</Name>
    <Type>Video</Type>
    <Size>24.5 MB</Size>
    <Modified>2 days ago</Modified>
    <Actions>
      <IconButton icon="download" />
      <IconButton icon="more" />
    </Actions>
  </ListRow>
</MediaList>
```

---

### 5. Media Types & Metadata

#### Video Card
```jsx
{
  id: "vid_123",
  type: "video",
  title: "Product Demo - Final Cut",
  thumbnail: "/thumbnails/vid_123.jpg",
  url: "/media/vid_123.mp4",
  duration: "00:15",
  resolution: "1920x1080",
  fps: 30,
  format: "MP4",
  size: "24.5 MB",
  createdAt: "2024-10-18T12:00:00Z",
  modifiedAt: "2024-10-18T14:30:00Z",
  package: "Gold Package",
  tags: ["product", "demo", "final"],
  favorite: false,
  downloads: 3
}
```

#### Image Card
```jsx
{
  id: "img_456",
  type: "image",
  title: "Brand Logo - Transparent",
  thumbnail: "/media/img_456.png",
  url: "/media/img_456.png",
  resolution: "4000x4000",
  format: "PNG",
  size: "2.1 MB",
  createdAt: "2024-10-15T09:00:00Z",
  modifiedAt: "2024-10-15T09:00:00Z",
  package: "Bronze Package",
  tags: ["logo", "branding"],
  favorite: true,
  downloads: 12
}
```

#### Scene/Project Card
```jsx
{
  id: "scene_789",
  type: "scene",
  title: "Summer Campaign - Scene 3",
  thumbnail: "/thumbnails/scene_789.jpg",
  assets: [
    { type: "video", count: 5 },
    { type: "image", count: 12 },
    { type: "audio", count: 2 }
  ],
  totalSize: "156.8 MB",
  createdAt: "2024-10-10T10:00:00Z",
  modifiedAt: "2024-10-18T16:00:00Z",
  package: "Platinum Package",
  tags: ["campaign", "summer", "social"],
  favorite: false
}
```

---

### 6. Preview Modal

#### Structure
```jsx
<PreviewModal>
  <ModalHeader>
    <Title>Product Demo - Final Cut</Title>
    <CloseButton />
  </ModalHeader>

  <PreviewArea>
    {/* For Videos */}
    <VideoPlayer
      src={mediaUrl}
      controls
      autoPlay
    />

    {/* For Images */}
    <ImageViewer
      src={mediaUrl}
      zoom
      pan
    />

    {/* For Scenes/Projects */}
    <AssetGallery
      assets={sceneAssets}
    />
  </PreviewArea>

  <Sidebar>
    <MetadataSection>
      <Field label="Type" value="Video" />
      <Field label="Resolution" value="1920x1080" />
      <Field label="Duration" value="00:15" />
      <Field label="Size" value="24.5 MB" />
      <Field label="Format" value="MP4" />
      <Field label="Created" value="Oct 18, 2024" />
      <Field label="Package" value="Gold Package" />
    </MetadataSection>

    <TagsSection>
      <Tags editable />
    </TagsSection>

    <ActionsSection>
      <Button primary icon="download">Download</Button>
      <Button icon="share">Share</Button>
      <Button icon="edit">Edit Details</Button>
      <Button icon="heart">Add to Favorites</Button>
    </ActionsSection>

    <VersionHistory>
      {/* If asset has versions */}
    </VersionHistory>
  </Sidebar>
</PreviewModal>
```

---

### 7. Upload Interface

#### Drag & Drop Zone
```jsx
<UploadZone>
  <DropArea
    onDrop={handleDrop}
    accept="video/*,image/*"
  >
    <Icon name="upload-cloud" size="xl" />
    <Title>Drag files here to upload</Title>
    <Subtitle>or click to browse</Subtitle>
    <SupportedFormats>
      Supports: MP4, MOV, PNG, JPG, GIF (max 2GB)
    </SupportedFormats>
  </DropArea>

  <UploadQueue>
    <UploadItem>
      <Thumbnail />
      <Info>
        <Name>video.mp4</Name>
        <Progress value={45} />
        <Size>24.5 MB / 54.2 MB</Size>
      </Info>
      <CancelButton />
    </UploadItem>
  </UploadQueue>
</UploadZone>
```

---

### 8. Collections / Packages View

#### Package Cards
```jsx
<PackageGrid>
  <PackageCard>
    <Header gradient="bronze">
      <Icon>📦</Icon>
      <Title>Bronze Package</Title>
      <Badge>12 items</Badge>
    </Header>

    <PreviewGrid>
      {/* Show 4-6 thumbnails */}
      <Thumbnail />
      <Thumbnail />
      <Thumbnail />
      <Thumbnail />
    </PreviewGrid>

    <Stats>
      <Stat icon="video" count="8" label="Videos" />
      <Stat icon="image" count="4" label="Images" />
    </Stats>

    <Actions>
      <Button>View All</Button>
      <Button>Download Package</Button>
    </Actions>
  </PackageCard>
</PackageGrid>
```

---

## 🔧 Key Features

### Search & Filter
- **Global Search**: Full-text search across all metadata
- **Smart Filters**: Filter by type, date, package, tags
- **Saved Searches**: Save frequently used filter combinations
- **Quick Filters**: One-click access to "Recent", "Favorites", "Downloads"

### Organization
- **Collections**: User-created folders
- **Tags**: Multi-tag support with autocomplete
- **Packages**: Auto-organized by purchased packages
- **Smart Collections**: Auto-populated based on rules

### Actions
- **Download**: Individual or bulk download
- **Share**: Generate shareable links with expiry
- **Preview**: Full-screen preview with metadata
- **Edit**: Rename, retag, update metadata
- **Move**: Move between collections
- **Delete**: Move to trash (30-day recovery)

### Performance
- **Lazy Loading**: Load thumbnails on scroll
- **Virtual Scrolling**: Handle 1000+ items smoothly
- **Thumbnail Caching**: CDN-cached thumbnails
- **Progressive Loading**: Low-res → High-res thumbnails

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  .sidebar { display: none; } /* Hamburger menu */
  .media-grid { grid-template-columns: 1fr; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .sidebar { width: 240px; }
  .media-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
  .sidebar { width: 280px; }
  .media-grid { grid-template-columns: repeat(4, 1fr); }
}

/* Large Desktop */
@media (min-width: 1536px) {
  .media-grid { grid-template-columns: repeat(5, 1fr); }
}
```

---

## 🎭 Animations

### Page Transitions
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

### Card Hover
```css
.media-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-card:hover {
  transform: translateY(-4px) scale(1.02);
}
```

### Loading States
- Skeleton screens for initial load
- Shimmer effect for lazy-loading
- Progress indicators for uploads

---

## 🔐 Access Control

### User Permissions
- View all media from purchased packages
- Upload custom assets (based on storage limit)
- Create collections
- Share media (with view/download permissions)

### Storage Limits
```jsx
<StorageIndicator>
  <ProgressBar>
    <Used>2.4 GB</Used>
    <Total>/ 10 GB</Total>
  </ProgressBar>
  <UpgradeButton>Upgrade Storage</UpgradeButton>
</StorageIndicator>
```

---

## 🚀 Technical Implementation

### Stack
- **Frontend**: Astro + React
- **State Management**: React Context / Zustand
- **Media Storage**: Vercel Blob / AWS S3
- **Database**: Neon PostgreSQL
- **Authentication**: Clerk
- **Search**: Algolia / Meilisearch
- **File Processing**: Sharp (images), FFmpeg (videos)

### API Endpoints
```typescript
GET    /api/media                    // List all media
GET    /api/media/:id                // Get single item
POST   /api/media/upload             // Upload new media
PUT    /api/media/:id                // Update metadata
DELETE /api/media/:id                // Delete media
GET    /api/media/search?q=          // Search media
GET    /api/packages/:id/media       // Get package media
POST   /api/collections              // Create collection
GET    /api/collections/:id/media    // Get collection media
```

---

## 📊 Sample Data Structure

```typescript
interface MediaItem {
  id: string;
  userId: string;
  type: 'video' | 'image' | 'scene' | 'project' | '3d' | 'audio';
  title: string;
  description?: string;
  thumbnail: string;
  url: string;
  metadata: {
    size: number;          // bytes
    format: string;        // mp4, png, etc.
    resolution?: string;   // 1920x1080
    duration?: number;     // seconds (video/audio)
    fps?: number;          // video
    bitrate?: number;      // video/audio
  };
  package?: string;        // package ID
  collection?: string[];   // collection IDs
  tags: string[];
  favorite: boolean;
  createdAt: Date;
  modifiedAt: Date;
  downloads: number;
  sharedWith?: string[];   // user IDs
}
```

---

## 🎨 Design Inspiration References

- **Canva**: https://www.canva.com/folder/all-your-designs
- **YouTube Studio**: https://studio.youtube.com/channel/videos
- **Google Drive**: https://drive.google.com/drive/my-drive
- **Dropbox**: https://www.dropbox.com/home
- **Frame.io**: https://app.frame.io/

---

## ✅ Implementation Phases

### Phase 1: Core Dashboard (MVP)
- [ ] Sidebar navigation
- [ ] Top bar with search
- [ ] Grid view with media cards
- [ ] Basic filtering (type, date)
- [ ] Preview modal
- [ ] Download functionality

### Phase 2: Enhanced Features
- [ ] List view
- [ ] Advanced search
- [ ] Collections
- [ ] Bulk actions
- [ ] Upload interface
- [ ] Tags system

### Phase 3: Advanced Features
- [ ] Sharing & permissions
- [ ] Version history
- [ ] Activity log
- [ ] Analytics dashboard
- [ ] AI-powered search
- [ ] Smart collections

---

This specification provides a complete blueprint for building a professional media management dashboard that combines the best UX patterns from industry-leading platforms while maintaining the Jam Social brand aesthetic.
