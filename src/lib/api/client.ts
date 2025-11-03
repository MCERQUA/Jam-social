// API Client for file storage backend
// Uses relative URL so Netlify proxy can route to VPS backend (bypasses mixed content)
// For large uploads (admin uploads), use direct VPS connection to avoid Netlify timeout
const API_URL = import.meta.env.PUBLIC_API_URL || '/api';
const DIRECT_API_URL = import.meta.env.PUBLIC_DIRECT_API_URL || 'https://api.jamsocial.app/api';

export interface StorageInfo {
  userId: string;
  totalBytes: number;
  maxBytes: number;
  fileCount: number;
  percentage: number;
  totalFormatted: string;
  maxFormatted: string;
  availableBytes: number;
  availableFormatted: string;
}

export interface UserFile {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileType: 'video' | 'image' | 'scene' | 'project' | 'audio';
  mimeType: string;
  fileSize: number;
  fileSizeFormatted: string;
  filePath: string;
  thumbnailPath: string | null;
  resolution: string | null;
  duration: string | null;
  packageName: string | null;
  tags: string[];
  isFavorite: boolean;
  uploadDate: string;
  createdAt: string;

  // DAM metadata
  assetCategory?: string | null;
  usageTags?: string[];
  characterNames?: string[];
  objectDescription?: string | null;
  sceneLocation?: string | null;
  hasAlphaChannel?: boolean;

  // Audio metadata
  audioCategory?: string | null;
  audioDurationSeconds?: number | null;
  audioStyle?: string | null;
  audioVocals?: boolean;
  audioLyrics?: string | null;
  audioTempo?: number | null;
  audioKey?: string | null;
  voiceoverType?: string | null;
  voiceoverScript?: string | null;

  // AI metadata
  aiMetadata?: Record<string, any>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    // Get Clerk session token
    if (typeof window !== 'undefined') {
      const { Clerk } = window as any;
      if (Clerk?.session) {
        try {
          // Force refresh to get a fresh token
          const token = await Clerk.session.getToken({ template: undefined });
          return token;
        } catch (error) {
          console.error('Error getting auth token:', error);
          return null;
        }
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Retry once on 401 Unauthorized (expired token)
    if (!response.ok && response.status === 401 && retryCount === 0) {
      console.log('Token expired, retrying with fresh token...');
      // Wait a moment before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.request<T>(endpoint, options, 1);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Storage endpoints
  async getStorageUsage(): Promise<StorageInfo> {
    const response = await this.request<{ success: boolean; storage: StorageInfo }>(
      '/storage/usage'
    );
    return response.storage;
  }

  async initializeStorage(maxBytes?: number): Promise<StorageInfo> {
    const response = await this.request<{ success: boolean; storage: StorageInfo }>(
      '/storage/initialize',
      {
        method: 'POST',
        body: JSON.stringify({ maxBytes }),
      }
    );
    return response.storage;
  }

  // File endpoints
  async getFiles(options?: {
    type?: string;
    favorite?: boolean;
    package?: string;
    tags?: string[];
    assetCategory?: string;
    usageTags?: string[];
    audioCategory?: string;
    characterNames?: string[];
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<UserFile[]> {
    const params = new URLSearchParams();

    if (options) {
      if (options.type) params.append('type', options.type);
      if (options.favorite !== undefined)
        params.append('favorite', String(options.favorite));
      if (options.package) params.append('package', options.package);
      if (options.tags) params.append('tags', options.tags.join(','));

      // DAM filters
      if (options.assetCategory) params.append('assetCategory', options.assetCategory);
      if (options.usageTags) params.append('usageTags', options.usageTags.join(','));
      if (options.audioCategory) params.append('audioCategory', options.audioCategory);
      if (options.characterNames) params.append('characterNames', options.characterNames.join(','));

      if (options.limit) params.append('limit', String(options.limit));
      if (options.offset) params.append('offset', String(options.offset));
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    }

    const query = params.toString();
    const response = await this.request<{ success: boolean; files: UserFile[] }>(
      `/files${query ? `?${query}` : ''}`
    );
    return response.files;
  }

  async uploadFiles(
    files: File[],
    metadata?: {
      fileType?: string;
      packageName?: string;
      tags?: string[];

      // DAM metadata
      assetCategory?: string;
      usageTags?: string[];
      characterNames?: string[];
      objectDescription?: string;
      sceneLocation?: string;
      hasAlphaChannel?: boolean;

      // Audio metadata
      audioCategory?: string;
      audioDurationSeconds?: number;
      audioStyle?: string;
      audioVocals?: boolean;
      audioLyrics?: string;
      audioTempo?: number;
      audioKey?: string;
      voiceoverType?: string;
      voiceoverScript?: string;

      // AI metadata
      aiMetadata?: Record<string, any>;
    }
  ): Promise<{ files: UserFile[]; errors?: any[] }> {
    const token = await this.getAuthToken();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    if (metadata) {
      if (metadata.fileType) formData.append('fileType', metadata.fileType);
      if (metadata.packageName) formData.append('packageName', metadata.packageName);
      if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));

      // DAM metadata
      if (metadata.assetCategory) formData.append('assetCategory', metadata.assetCategory);
      if (metadata.usageTags) formData.append('usageTags', JSON.stringify(metadata.usageTags));
      if (metadata.characterNames) formData.append('characterNames', JSON.stringify(metadata.characterNames));
      if (metadata.objectDescription) formData.append('objectDescription', metadata.objectDescription);
      if (metadata.sceneLocation) formData.append('sceneLocation', metadata.sceneLocation);
      if (metadata.hasAlphaChannel !== undefined) formData.append('hasAlphaChannel', String(metadata.hasAlphaChannel));

      // Audio metadata
      if (metadata.audioCategory) formData.append('audioCategory', metadata.audioCategory);
      if (metadata.audioDurationSeconds) formData.append('audioDurationSeconds', String(metadata.audioDurationSeconds));
      if (metadata.audioStyle) formData.append('audioStyle', metadata.audioStyle);
      if (metadata.audioVocals !== undefined) formData.append('audioVocals', String(metadata.audioVocals));
      if (metadata.audioLyrics) formData.append('audioLyrics', metadata.audioLyrics);
      if (metadata.audioTempo) formData.append('audioTempo', String(metadata.audioTempo));
      if (metadata.audioKey) formData.append('audioKey', metadata.audioKey);
      if (metadata.voiceoverType) formData.append('voiceoverType', metadata.voiceoverType);
      if (metadata.voiceoverScript) formData.append('voiceoverScript', metadata.voiceoverScript);

      // AI metadata
      if (metadata.aiMetadata) formData.append('aiMetadata', JSON.stringify(metadata.aiMetadata));
    }

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async adminUploadFiles(
    targetUserId: string,
    files: File[],
    metadata?: {
      fileType?: string;
      packageName?: string;
      tags?: string[];
      assetCategory?: string;
      usageTags?: string[];
      characterNames?: string[];
      objectDescription?: string;
      sceneLocation?: string;
      hasAlphaChannel?: boolean;
      audioCategory?: string;
      audioDurationSeconds?: number;
      audioStyle?: string;
      audioVocals?: boolean;
      audioLyrics?: string;
      audioTempo?: number;
      audioKey?: string;
      voiceoverType?: string;
      voiceoverScript?: string;
      aiMetadata?: Record<string, any>;
    }
  ): Promise<{ files: UserFile[]; errors?: any[]; message?: string }> {
    const token = await this.getAuthToken();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Add target user ID for admin upload
    formData.append('targetUserId', targetUserId);

    if (metadata) {
      if (metadata.fileType) formData.append('fileType', metadata.fileType);
      if (metadata.packageName) formData.append('packageName', metadata.packageName);
      if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));

      // DAM metadata
      if (metadata.assetCategory) formData.append('assetCategory', metadata.assetCategory);
      if (metadata.usageTags) formData.append('usageTags', JSON.stringify(metadata.usageTags));
      if (metadata.characterNames) formData.append('characterNames', JSON.stringify(metadata.characterNames));
      if (metadata.objectDescription) formData.append('objectDescription', metadata.objectDescription);
      if (metadata.sceneLocation) formData.append('sceneLocation', metadata.sceneLocation);
      if (metadata.hasAlphaChannel !== undefined) formData.append('hasAlphaChannel', String(metadata.hasAlphaChannel));

      // Audio metadata
      if (metadata.audioCategory) formData.append('audioCategory', metadata.audioCategory);
      if (metadata.audioDurationSeconds) formData.append('audioDurationSeconds', String(metadata.audioDurationSeconds));
      if (metadata.audioStyle) formData.append('audioStyle', metadata.audioStyle);
      if (metadata.audioVocals !== undefined) formData.append('audioVocals', String(metadata.audioVocals));
      if (metadata.audioLyrics) formData.append('audioLyrics', metadata.audioLyrics);
      if (metadata.audioTempo) formData.append('audioTempo', String(metadata.audioTempo));
      if (metadata.audioKey) formData.append('audioKey', metadata.audioKey);
      if (metadata.voiceoverType) formData.append('voiceoverType', metadata.voiceoverType);
      if (metadata.voiceoverScript) formData.append('voiceoverScript', metadata.voiceoverScript);

      // AI metadata
      if (metadata.aiMetadata) formData.append('aiMetadata', JSON.stringify(metadata.aiMetadata));
    }

    // Use DIRECT API URL to bypass Netlify proxy timeout (26s limit)
    // Large file uploads go directly to VPS backend
    const response = await fetch(`${DIRECT_API_URL}/files/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new Error(error.error || 'Admin upload failed');
    }

    return response.json();
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(fileId: string): Promise<UserFile> {
    const response = await this.request<{ success: boolean; file: UserFile }>(
      `/files/${fileId}/favorite`,
      {
        method: 'POST',
      }
    );
    return response.file;
  }

  async updateFileTags(fileId: string, tags: string[]): Promise<UserFile> {
    const response = await this.request<{ success: boolean; file: UserFile }>(
      `/files/${fileId}/tags`,
      {
        method: 'PUT',
        body: JSON.stringify({ tags }),
      }
    );
    return response.file;
  }

  getThumbnailUrl(fileId: string): string {
    return `${this.baseUrl}/files/${fileId}/thumbnail`;
  }

  async getThumbnailBlob(fileId: string): Promise<string | null> {
    try {
      const token = await this.getAuthToken();

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/files/${fileId}/thumbnail`, {
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch thumbnail:', response.status);
        return null;
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching thumbnail blob:', error);
      return null;
    }
  }

  getDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/files/${fileId}/download`;
  }

  // Get video/audio stream URL for playback
  getStreamUrl(fileId: string): string {
    return `${this.baseUrl}/files/${fileId}/stream`;
  }

  // Get video blob URL for hover preview
  async getVideoBlob(fileId: string): Promise<string | null> {
    try {
      const token = await this.getAuthToken();

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/files/${fileId}/stream`, {
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch video:', response.status);
        return null;
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching video blob:', error);
      return null;
    }
  }

  // Get audio blob URL for playback
  async getAudioBlob(fileId: string): Promise<string | null> {
    try {
      const token = await this.getAuthToken();

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/files/${fileId}/stream`, {
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch audio:', response.status);
        return null;
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching audio blob:', error);
      return null;
    }
  }

  // Admin endpoints
  async getClerkUsers(): Promise<any[]> {
    const response = await this.request<{ success: boolean; users: any[]; count: number }>(
      '/admin/users'
    );
    return response.users;
  }

  async getAdminUserFiles(
    userId: string,
    options?: {
      type?: string;
      favorite?: boolean;
      package?: string;
      tags?: string[];
      assetCategory?: string;
      usageTags?: string[];
      audioCategory?: string;
      characterNames?: string[];
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<UserFile[]> {
    const params = new URLSearchParams();

    if (options) {
      if (options.type) params.append('type', options.type);
      if (options.favorite !== undefined)
        params.append('favorite', String(options.favorite));
      if (options.package) params.append('package', options.package);
      if (options.tags) params.append('tags', options.tags.join(','));

      // DAM filters
      if (options.assetCategory) params.append('assetCategory', options.assetCategory);
      if (options.usageTags) params.append('usageTags', options.usageTags.join(','));
      if (options.audioCategory) params.append('audioCategory', options.audioCategory);
      if (options.characterNames) params.append('characterNames', options.characterNames.join(','));

      if (options.limit) params.append('limit', String(options.limit));
      if (options.offset) params.append('offset', String(options.offset));
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    }

    const query = params.toString();
    const response = await this.request<{ success: boolean; files: UserFile[] }>(
      `/admin/files/${userId}${query ? `?${query}` : ''}`
    );
    return response.files;
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
