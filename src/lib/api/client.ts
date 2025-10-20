// API Client for file storage backend
// Uses relative URL so Netlify proxy can route to VPS backend (bypasses mixed content)
const API_URL = import.meta.env.PUBLIC_API_URL || '/api';

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
        return await Clerk.session.getToken();
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
